import Joi from "joi";

export const newProduct = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().min(1).required(),
  discount: Joi.number().min(1).max(90),
  discription: Joi.string().min(5).required(),
  quantity: Joi.number().min(1).required(),
  categoryId:Joi.string().hex().length(24).required(),
  subcategoryId:Joi.string().hex().length(24).required(),
  brandId:Joi.string().hex().length(24).required()
});

export const editProduct = Joi.object({
  _id:Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(100),
  price: Joi.number().min(1),
  discount: Joi.number().min(1).max(90),
  discription: Joi.string().min(5),
  quantity: Joi.number().min(1),
});

export const wishList = Joi.object({
  productId: Joi.string().hex().length(24).required()
});

export const product = Joi.object({
  password: Joi.string().min(8).max(20).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')),
  rePassword: Joi.ref('password')
});
