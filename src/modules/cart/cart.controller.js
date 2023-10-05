import cartModel from '../../../database/models/cart.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";

export const addToCart = catchError(async(req , res , next)=>{
    const {productId , quantity} = req.body;
    const product = await productModel.findById(productId);
    if(!product) return next(new AppError('Product not found' , 400));
    if(product.quantity < quantity) return next(new AppError('Not Available' , 400));
    req.body.price = product.price;
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart){
        let saveCart = new cartModel({
            userId:req.user._id,
            cartItems: [req.body]
        });
        calcTotalPrice(saveCart);
        await saveCart.save();
        return res.status(200).json({message:"success" , saveCart});
    }
    let item = cart.cartItems.find((element)=> element.productId.toString() == productId);
    if(item){
        product.quantity = quantity || 1;
    }else{
        cart.cartItems.push(req.body)
    }
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({message:"success" , cart})
});

export const removeFromCart = catchError(async(req , res , next)=>{
    let cart = await cartModel.findOneAndUpdate({user:req.user._id} , {$pull : {cartItems:{_id: req.params.id}}}, {new:true});
    if(!cart) return next(new AppError('Product Not Found' , 400));
    res.status(200).json({message:"success" , cart})
});

export const updateQuantity = catchError(async(req , res , next)=>{
    const {productId , quantity} = req.body;
    const product = await productModel.findById(productId);
    if(!product) return next(new AppError('Product not found' , 400));
    if(product.quantity < quantity) return next(new AppError('Not Available' , 400));
    const cart = await cartModel.findOne({userId:req.user._id});
    let item = cart.cartItems.find((element)=> element.productId.toString() == productId);
    if(item){
        product.quantity = quantity || 1;
    }
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({message:"success" , cart})
});

export const applyCoupon = catchError(async(req , res , next)=>{
    const {code} = req.body;
    let coupon = await couponModel.findOne({code});
    if(!coupon) return next(new AppError('Invalid Coupon' , 400));
    const state = couponValidation(coupon , req.user._id );
    if(state == 'expired' || state == 'used') return next(new AppError('Invalid Coupon' , 400));
    coupon.users.push(req.user._id);
    await coupon.save();
    let cart = await cartModel.findOne({userId:req.user._id});
    if(!cart) return next(new AppError('Not Found cart' , 400));
    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.amount)/100;
    await cart.save();
    res.status(200).json({message:"success" , cart});
})

export const couponValidation = (coupon, userId) => {
    let now = new Date();
    now = parseInt(now.getTime() / 1000);
    let toDate = parseInt(coupon.toDate.getTime() / 1000);
    if (coupon.couponStatus == "expired" || now > toDate) {
      coupon.couponStatus = "expired";
      return "expired";
    }
    for (const user of coupon.users) {
      if (user.toString() == userId.toString()) {
        return "used";
      }
    }
    if(coupon.users.length == usageCount) {
        coupon.couponStatus = "expired";
        return "expired";
    }
    return "valid";
  };
  
const calcTotalPrice = (cart)=>{
    let totalPrice = 0;
    for(const data in cart.cartItems){
        totalPrice += data.price * data.quantity;
    }
    cart.totalPrice = totalPrice;
}
