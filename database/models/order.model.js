import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: [true, "product id required"],
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        }
      },
    ],
    address:{
        type: String,
        required: [true, "Address required"],
    },
    phoneNumber : {
        type: [String],
        required: [true, "Phone Number required"],
    },
    subTotal:{
        type:Number,
        required: true,
        default: 0
    },
    couponId: {
        type: mongoose.Types.ObjectId,
        ref: "coupon",
    },
    totalPrice:{
        type:Number,
        required: true,
        default: 0
    },
    paymentMethod:{
        type: String,
        default: "cash",
        enum : ["cash" , "card"]
    },
    orderStatus: {
        type: String,
        enum:['pending' , 'confirmed' , 'placed' , 'on way' , 'deliverd' , 'cancelled']
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
