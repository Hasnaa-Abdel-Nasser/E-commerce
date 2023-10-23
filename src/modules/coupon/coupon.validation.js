import Joi from "joi";

export const createCoupon = Joi.object({
  code: Joi.string().min(5).max(10).required(),
  amount: Joi.number().min(1).max(90).required(),
  fromDate: Joi.date().greater(Date.now()).required(),
  toDate: Joi.date().greater(Date.now()).required(),
  usageCount: Joi.number().min(1).required()
});

export const editCoupon = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  amount: Joi.number().min(1).max(90),
  fromDate: Joi.date().greater(Date.now()),
  toDate: Joi.date().greater(Date.now()),
  usageCount: Joi.number().min(1)
});
