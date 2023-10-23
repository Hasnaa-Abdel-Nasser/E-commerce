import Joi from "joi";

export const addCategory = Joi.object({
  name: Joi.string().min(3).max(20).required(),
});

export const editCategory = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  _id: Joi.string().hex().length(24).required(),
});
