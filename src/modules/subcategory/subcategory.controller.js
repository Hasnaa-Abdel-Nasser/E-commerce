import subcategoryModel from '../../../database/models/subcategory.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import { ApiFeatures } from "../../utils/api.features.js";
import slugify from "slugify";

export const addSubcategory = catchError(async(req,res,next)=>{
    const {name , categoryId} = req.body;
    const subcategory = await subcategoryModel.findOne({name , categoryId});
    if(subcategory) return next(new AppError('Subcategory Name is Exist.' , 400));
    req.body.slug = slugify(name);
    const result = await subcategoryModel.insertMany(req.body);
    res.status(200).json({message:'success' , subcategory: result});
});

export const listAllSubcategories = catchError(async(req,res,next)=>{
    const subcategories = await subcategoryModel.find();
    res.status(200).json({message:'success' , subcategories});
});

export const editSubcategory = catchError(async(req,res,next)=>{
   const {_id , name} = req.body;
    req.body.slug = slugify(name);
   const subcategory = await subcategoryModel.findByIdAndUpdate(_id , req.body , {new:true});
   if(!subcategory) return next(new AppError('Not Found Category' , 400));
   res.status(200).json({message:'success' , subcategory});
});

export const deleteSubcategory = catchError(async(req,res,next)=>{
    const subcategory = await subcategoryModel.findByIdAndDelete(req.params._id);
    if(!subcategory) return next(new AppError('Not Found Category' , 400));
    res.status(200).json({ message: "success"});
});
