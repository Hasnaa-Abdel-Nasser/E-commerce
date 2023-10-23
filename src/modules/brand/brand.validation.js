import Joi from "joi";

export const addNewBrand = Joi.object({
  name: Joi.string().min(1).max(20).required(),
});