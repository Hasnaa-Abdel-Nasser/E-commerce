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
          required: true,
        },
        name:String,
        price: Number,
        discount: Number
      }
    ],
    address:{
        type: String,
        required: [true, "Address required"],
    },
    phoneNumber : {
        type: String,
        required: [true, "Phone Number required"],
    },
    paymentMethod:{
        type: String,
        default: "cash",
        enum : ["cash" , "card"]
    },
    orderStatus: {
        type: String,
        enum:['pending' , 'confirmed' , 'placed' , 'on way' , 'delivered' , 'cancelled']
    },
    totalOrderPrice: Number,
    totalPrice: Number,
    couponId:{
      type: mongoose.Types.ObjectId,
      ref: "coupon",
    }
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
