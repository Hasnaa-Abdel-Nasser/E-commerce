import productModel from "../../../database/models/product.model.js";
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import {ApiFeatures} from '../../utils/api.features.js';
import slugify from "slugify";
import {uploadToCloudinary} from '../../utils/files.uploads.js';
import userModel from "../../../database/models/user.model.js";
export const newProduct = catchError(async (req, res, next) => {
    const { name } = req.body;
    if (!req.files || !req.files.imageCover || !req.files.images) {
      return next(new AppError('Please enter full images.', 400));
    }
    const findProduct = await productModel.findOne({ name });
    if (findProduct) {
      return next(new AppError('This Exist Product Name', 400));
    }
    console.log(req.body)
    req.body.slug = slugify(name);
    const { secure_url, public_id } = await uploadToCloudinary(req.files.imageCover[0].path, 'products');
    req.body.imageCover = { secure_url, public_id };
    const images = await Promise.all(req.files.images.map(async (image) => {
      const { secure_url, public_id } = await uploadToCloudinary(image.path, 'products');
      return { secure_url, public_id };
    }));
    req.body.images = images;
    const product = await productModel.insertMany(req.body);
    if (!product)
      return next(new AppError("Can't save new product.", 400));
    res.status(200).json({ message: 'success' });
});

export const editProduct = catchError(async(req, res, next) => {
  const{_id} = req.body;
  if(req.body.name){
    req.body.slug= slugify(req.body.name);
  }
  const product= await productModel.findByIdAndUpdate(_id , req.body , {new:true});
  if(!product) 
    return next(new AppError("Not Found Product.", 400));
    res.status(200).json({ message: 'success' , product});
});

export const listAllProducts = catchError(async(req, res, next) => {
  // pages , filter , find , search
  const products = await productModel.find();
  res.status(200).json(products);
});

export const deleteProduct = catchError(async(req, res, next) => {
  const product = await productModel.findByIdAndDelete(req.params._id);
  if(!product) 
    return next(new AppError("Not Found Product.", 400));
  await cloudinary.uploader.destroy(product.imageCover.public_id);
  for(let i=0;i<product.images.length;i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }
  res.status(200).json({ message: 'success'});
});

export const getProductById = catchError(async(req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if(!product) 
    return next(new AppError("Not Found Product.", 400));
  res.status(200).json({ message: 'success' , product});
});

export const addProductToWishlist = catchError(async(req, res, next)=>{
  const {productId , userId} = req.body;
  const product = await productModel.findById({_id: productId});
  const user = await userModel.findById({_id:userId});
  if(!product || !user) return next(new AppError("Not Found Product or User.", 400));
  await userModel.updateOne({_id: userId}, {$push: {wishList: productId}});
  res.status(200).json({
    message: "Product added to wishlist successfully"
  });
});

export const removeProductFromWishlist = catchError(async(req,res,next)=>{
  const {productId, userId} = req.body;
  const user = await userModel.findOneAndUpdate({_id: userId} , {$pull: {wishList: productId}});
  if(!user) return next(new AppError("Not Found User", 400));
  res.status(200).json({
    message: "Product removed from wishlist successfully"
  });
})