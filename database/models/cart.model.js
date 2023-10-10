import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
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
        name: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: Number,
        discount: Number
      }
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    totalPriceAfterCoupon:Number,
    couponId:{
      type: mongoose.Types.ObjectId,
      ref: "coupon",
    }
  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;
