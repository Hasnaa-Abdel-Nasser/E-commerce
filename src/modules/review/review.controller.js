import reviewModel from '../../../database/models/review.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import { ApiFeatures } from "../../utils/api.features.js";


export const addReview = catchError(async(req,res,next)=>{
    
});

export const editReview = catchError(async(req,res,next)=>{

});

export const deleteReview = catchError(async(req,res,next)=>{
});

export const getAllProductReviews = catchError(async(req,res,next)=>{
    const {productId} = req.params;
    const reviews = await reviewModel.find({productId});
    res.status(200).json({message:'success' , reviews});
});