import orderModel from '../../../database/models/order.model.js';
import cartModel from '../../../database/models/cart.model.js';
import productModel from '../../../database/models/product.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";

export const createOrder = catchError(async(req,res,next)=>{
   const userId = req.user._id;
   const {address , phoneNumber , paymentMethod} = req.body;
   const cart = await cartModel.findOne({userId});
   if(!cart) return next(new AppError('Empty cart.' , 400));
   if(paymentMethod == 'cash'){
    const order = new orderModel({
        userId,
        cartItems: cart.cartItems,
        address,
        phoneNumber,
        paymentMethod,
        orderStatus: 'placed',
        totalPrice: cart.totalPrice,
        totalOrderPrice: cart.totalPriceAfterCoupon || cart.totalPriceAfterDiscount || cart.totalPrice,
        couponId: cart.couponId
       });
       const saveOrder = await order.save();
       if(!saveOrder) return next(new AppError('Sorry, Can\'t save order try again.' , 400));
   }else{
    // Online payment
   }
   for(const item of cart.cartItems) {
        await productModel.findByIdAndUpdate(item.productId,{
            $inc: {quantity: -parseInt(item.quantity)}
        });
   }
   await cartModel.findByIdAndDelete(cart._id);
   res.status(200).json({message:'success' , order:saveOrder});
});
const onlinePayment = ()=>{
    
}
// test
export const cancelOrder = catchError(async(req,res,next)=>{
    const {_id} = req.body;
    const order = await orderModel.findById(_id);
    if(!order) return next(new AppError('Not Found .' , 400));
    for(const item of order.cart.cartItems) {
        await productModel.findByIdAndUpdate(item.productId,{
            $inc: {quantity: parseInt(item.quantity)}
        });
   }
   res.status(200).json({message:'success' , order:saveOrder});
});

export const getUserOrders = catchError(async(req,res,next)=>{
    const orders = await orderModel.find({userId: req.user._id});
    res.status(200).json({message:"success" , orders});
});

export const getAllOrders = catchError(async(req , res , next)=>{
    const orders = await orderModel.find();
    res.status(200).json({message:"success" , orders});
});


