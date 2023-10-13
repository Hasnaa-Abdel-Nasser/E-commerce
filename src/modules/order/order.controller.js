import orderModel from "../../../database/models/order.model.js";
import cartModel from "../../../database/models/cart.model.js";
import couponModel from "../../../database/models/coupon.model.js";
import productModel from "../../../database/models/product.model.js";
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import payment from "../../utils/payment.js";
import Stripe from "stripe";
import { createInvoice } from "../../utils/invoice.js";
import sendEmail from "../../utils/email.validation.js";
// import * as dotenv from 'dotenv';
// dotenv.config();
export const createOrder = catchError(async (req, res, next) => {
  const userId = req.user._id;
  const { address, phoneNumber, paymentMethod } = req.body;
  const cart = await cartModel.findOne({ userId });
  if (!cart) return next(new AppError("Empty cart.", 400));
  paymentMethod == "cash"
    ? (req.body.orderStatus = "placed")
    : (req.body.orderStatus = "pending");
  const order = new orderModel({
    userId,
    cartItems: cart.cartItems,
    address,
    phoneNumber,
    paymentMethod,
    orderStatus: req.body.orderStatus,
    totalPrice: cart.totalPrice,
    totalOrderPrice:
      cart.totalPriceAfterCoupon ||
      cart.totalPriceAfterDiscount ||
      cart.totalPrice,
    couponId: cart.couponId,
  });
  const saveOrder = await order.save();
  if (!saveOrder)
    return next(new AppError("Sorry, Can't save order try again.", 400));
  for (const item of cart.cartItems) {
    await productModel.findByIdAndUpdate(item.productId, {
      $inc: { quantity: -parseInt(item.quantity) },
    });
  }
  const coupon = await couponModel.findById(cart.couponId);
  await cartModel.findByIdAndDelete(cart._id);
  await createInvoice(saveOrder,'invoice.pdf' , req.user.name , (coupon)?coupon.amount:0);
  sendEmail({
    email:req.user.email,
    subject: 'Cart Invoice',
    attachments: [{
      path: 'invoice.pdf',
      contentType: 'application/pdf'
    }],
  },'invoice')
  //online payment
  if (paymentMethod == "card") {
    if (coupon) {
      console.log(coupon);
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const couponData = await stripe.coupons.create({
        percent_off: coupon.amount,
        duration: "once",
      });
      req.body.couponId = couponData.id;
    }
    const session = await payment({
      customer_email: req.user.email,
      metadata: {
        order: order._id.toString(),
      },
      cancel_url: `${process.env.CANCEL_URL}?orderId=${order._id.toString()}`,
      line_items: order.cartItems.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.discount
              ? (product.price -
                  +((product.discount * product.price) / 100).toFixed(2)) * 100
              : product.price * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: coupon._id ? [{ coupon: req.body.couponId }] : [],
    });
    if(session.url){
      order.orderStatus = 'confirmed';
      await order.save();
    }
    return res
      .status(200)
      .json({ message: "success", order: saveOrder, url: session.url });
  }
  res.status(200).json({ message: "success", order: saveOrder });
});

export const cancelOrder = catchError(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await orderModel.findById(orderId);
  if (!order) return next(new AppError("Not Found .", 400));
  if(order.orderStatus == 'cancelled') return next(new AppError("Order Already Cancelled.", 400));
  for (const item of order.cartItems) {
    await productModel.findByIdAndUpdate(item.productId, {
      $inc: { quantity: parseInt(item.quantity) },
    });
  }
  order.orderStatus = "cancelled";
  await order.save();
  res.status(200).json({ message: "success" });
});

export const getUserOrders = catchError(async (req, res, next) => {
  const orders = await orderModel.find({ userId: req.user._id });
  res.status(200).json({ message: "success", orders });
});

export const getAllOrders = catchError(async (req, res, next) => {
  const orders = await orderModel.find();
  res.status(200).json({ message: "success", orders });
});

export const orderDelivered = catchError(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await orderModel.findByIdAndUpdate(orderId , {orderStatus: "delivered"});
  res.status(200).json({ message: "success" });
})
