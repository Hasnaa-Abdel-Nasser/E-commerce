import Joi from "joi";

export const cart = Joi.object({  // add to cart , update quantity
  productId:Joi.string().hex().length(24).required(),
  quantity:Joi.number().min(1).required()
});

export const applyCoupon = Joi.object({ // apply coupon
  code: Joi.string().min(5).max(10).required(),
});
