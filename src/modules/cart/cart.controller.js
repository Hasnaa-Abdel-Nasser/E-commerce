import cartModel from '../../../database/models/cart.model.js';
import productModel from '../../../database/models/product.model.js';
import couponModel from '../../../database/models/coupon.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";

export const addToCart = catchError(async(req , res , next)=>{
    const {productId , quantity} = req.body;
    const product = await productModel.findById(productId);
    if(!product) return next(new AppError('Product not found' , 400));
    if(product.quantity < quantity) return next(new AppError('Not Available' , 400));
    if(quantity == 0) return next(new AppError('Not Valid' , 400));
    req.body.price = product.price;
    req.body.discount = product.discount;
    req.body.name = product.name;
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
    let item = cart.cartItems.find((product)=>{ 
        if(product.productId.toString() == productId){
            product.quantity = quantity;
            return true;
        }});
    if(!item){
        cart.cartItems.push(req.body)
    }
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({message:"success" , cart})
});

export const removeFromCart = catchError(async(req , res , next)=>{
    const id = req.params.id;
    let cart = await cartModel.findOneAndUpdate({user:req.user._id} , {$pull : {cartItems:{_id: id}}});
    if(!cart) return next(new AppError('Product Not Found' , 400));
    let found = cart.cartItems.find((product)=>{
        if(product._id.toString() == id){
            console.log(product._id)
            cart.totalPrice -= (product.price * product.quantity).toFixed(2);
            return true;
        }
    })
    if(found) await cart.save();
    res.status(200).json({message:"success"})
});

export const updateQuantity = catchError(async(req , res , next)=>{
    const {productId , quantity} = req.body;
    const product = await productModel.findById(productId);
    if(!product) return next(new AppError('Product not found' , 400));
    if(product.quantity < quantity) return next(new AppError('Not Available' , 400));
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart) return next(new AppError('Cart not found cart'))
    cart.cartItems.find((product)=>{ 
        if(product.productId.toString() == productId){
            product.quantity = quantity;
            return true;
    }});
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({message:"success" , cart})
});

export const applyCoupon = catchError(async(req , res , next)=>{
    const {code} = req.body;
    let coupon = await couponModel.findOne({code});
    if(!coupon) return next(new AppError('Invalid Coupon' , 400));
    const state = couponValidation(coupon , req.user._id );
    if(state == 'expired' || state == 'used'){
        await coupon.save();
        return next(new AppError(`Coupon is ${state}` , 400));
    }
    let cart = await cartModel.findOne({userId:req.user._id});
    if(!cart) return next(new AppError('Not Found cart' , 400));
    if(cart.couponId) return next(new AppError('You are already used coupon' , 400));
    coupon.users.push(req.user._id);
    await coupon.save();
    let price = cart.totalPriceAfterDiscount || cart.totalPrice;
    cart.totalPriceAfterCoupon = price - (price * coupon.amount)/100;
    cart.couponId = coupon._id;
    await cart.save();
    res.status(200).json({message:"success" , cart});
})

export const couponValidation = (coupon, userId) => {
    let now = new Date();
    now = parseInt(now.getTime() / 1000);
    let toDate = parseInt(coupon.toDate.getTime() / 1000);
    if (coupon.couponStatus == "expired" || now > toDate ||
        coupon.users.length == coupon.usageCount) {
            coupon.couponStatus = 'expired';
            return "expired";
    }
    for (const user of coupon.users) {
      if (user.toString() == userId.toString()) {
        return "used";
      }
    }
    return "valid";
  };
  
const calcTotalPrice = (cart)=>{
    let totalPrice = 0;
    let totalPriceAfterDiscount = 0;
    for(const value of cart.cartItems){
        let price = value.price - ((value.price * value.discount)/100).toFixed(2);
        totalPriceAfterDiscount += +(price * value.quantity).toFixed(2);
        totalPrice += +(value.price * value.quantity).toFixed(2) ;
    }
    cart.totalPrice = totalPrice;
    if(totalPriceAfterDiscount)
      cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
}
