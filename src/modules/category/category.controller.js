import categoryModel from '../../../database/models/category.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import { ApiFeatures } from "../../utils/api.features.js";
import slugify from "slugify";

export const addCategory = catchError(async(req,res,next)=>{
    const {name} = req.body;
    const category = await categoryModel.findOne({name});
    if(category) return next(new AppError('Category Name is Exist.' , 400));
    req.body.slug = slugify(name);
    const result = await categoryModel.insertMany(req.body);
    res.status(200).json({message:'success' , category: result});
});

export const listAllCategories = catchError(async(req,res,next)=>{
    const apiFeatures = new ApiFeatures( categoryModel.find() , req.query).filter().fields().sort();
    const categories = await apiFeatures.mongooseQuery;
    res.status(200).json({message:'success' , categories});
});

export const editCategory = catchError(async(req,res,next)=>{
   const {_id , name} = req.body;
    req.body.slug = slugify(name);
   const category = await categoryModel.findByIdAndUpdate(_id , req.body , {new:true});
   if(!category) return next(new AppError('Not Found Category' , 400));
   res.status(200).json({message:'success' , category});
});

export const deleteCategory = catchError(async(req,res,next)=>{
    const category = await categoryModel.findByIdAndDelete(req.params._id);
    if(!category) return next(new AppError('Not Found Category' , 400));
    res.status(200).json({ message: "success"});
});
