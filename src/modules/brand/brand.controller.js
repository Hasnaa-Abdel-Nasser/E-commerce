import brandModel from '../../../database/models/brand.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import { ApiFeatures } from "../../utils/api.features.js";
import slugify from "slugify";
import { uploadToCloudinary } from '../../utils/files.uploads.js';
import cloudinary from '../../utils/cloudinary.js';

export const addBrand = catchError(async(req,res,next)=>{
    const {name} = req.body;
    if(!req.file)  return next(new AppError('Pleace Upload Brand Logo' , 400));
    const brand = await brandModel.findOne({name});
    if(brand) return next(new AppError('Brand Name is Exist.' , 400));
    req.body.slug = slugify(name);
    const { secure_url, public_id } = await uploadToCloudinary(req.file.path, 'brands');
    req.body.logo = { secure_url, public_id };
    const result = await brandModel.insertMany(req.body);
    res.status(200).json({message:'success' , brand: result});
});

export const editBrandName = catchError(async(req,res,next)=>{
   const {_id , name} = req.body;
    req.body.slug = slugify(name);
   const brand = await brandModel.findByIdAndUpdate(_id , req.body , {new:true});
   if(!brand) return next(new AppError('Not Found Brand' , 400));
   res.status(200).json({message:'success' , brand});
});

export const editBrandLogo = catchError(async(req,res,next)=>{
    const {_id} = req.body;
    if(!req.file) return next(new AppError('Please Upload Brand Logo' , 400));
    const { secure_url, public_id } = await uploadToCloudinary(req.file.path, 'brands');
    const brand = await brandModel.findByIdAndUpdate(_id , {logo:{ secure_url, public_id }});
    console.log(req.body);
    if(!brand) return next(new AppError('Not Found Brand' , 400));
    await cloudinary.uploader.destroy(brand.logo.public_id);
    res.status(200).json({ message: "success"});
});

export const deleteBrand = catchError(async(req,res,next)=>{
    const brand = await brandModel.findByIdAndDelete(req.params._id);
    if(!brand) return next(new AppError('Not Found Brand' , 400));
    await cloudinary.uploader.destroy(brand.logo.public_id); // to delete logo image from server
    res.status(200).json({ message: "success"});
});

export const listAllBrands = catchError(async(req,res,next)=>{
    const brands = await brandModel.find();
    res.status(200).json({message:'success' , brands});
});

