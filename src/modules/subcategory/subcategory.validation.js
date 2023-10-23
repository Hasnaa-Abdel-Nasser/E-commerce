import Joi from "joi";

export const addSubcategory = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  categoryId:Joi.string().hex().length(24).required()
});

export const editSubcategory = Joi.object({
  _id:Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(20).required(),
});