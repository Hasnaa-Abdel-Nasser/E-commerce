import Joi from "joi";

export const createReview = Joi.object({
  comment: Joi.string().min(1).max(100).required(),
  rating: Joi.number().min(1).max(5).required(),
  productId: Joi.string().hex().length(24).required()
});

export const editReview = Joi.object({
  _id:Joi.string().hex().length(24).required(),
  comment: Joi.string().min(1).max(100),
  rating: Joi.number().min(1).max(5),
});