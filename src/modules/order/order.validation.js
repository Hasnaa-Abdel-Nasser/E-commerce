import Joi from "joi";

export const createOrder = Joi.object({
  address: Joi.string().min(3).max(100).required(),
  phoneNumber: Joi.string().required().email(),
  paymentMethod: Joi.string().valid("cash", "card").required()
});

export const orderId = Joi.object({
  orderId: Joi.string().hex().length(24).required()
});
