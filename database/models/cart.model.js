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
        quantity: {
          type: Number,
          required: true,
        },
        price: Number,
        discount: Number
      }
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number
  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;
