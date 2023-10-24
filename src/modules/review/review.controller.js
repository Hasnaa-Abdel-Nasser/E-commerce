import reviewModel from '../../../database/models/review.model.js';
import productModel from '../../../database/models/product.model.js';
import orderModel from '../../../database/models/order.model.js';
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import { ApiFeatures } from "../../utils/api.features.js";


export const createReview = catchError(async(req,res,next)=>{
    const {comment , rating , productId} = req.body;
    const order = await orderModel.findOne({userId:req.user._id,orderStatus:'delivered',"cartItems.productId":productId});
    if(!order){
        return next(new AppError('Can\'t review product before receive it' , 400));
    }
    const findReview = await reviewModel.findOne({createdBy:req.user._id , productId , orderId: order._id});
    if(findReview){
        return next(new AppError('Already reviewed product.' , 400));
    }
    const product = await productModel.findById(productId)
    product.ratingNumber += rating;
    product.ratingCount += 1;
    product.ratingAvg = (product.ratingNumber + rating) / (product.ratingCount+1);
    await product.save();
    const review = await reviewModel.insertMany({createdBy:req.user._id , productId , orderId:order._id,comment,rating})
    res.status(200).json({message:'success' , review})
});

export const editReview = catchError(async(req,res,next)=>{
    const {_id} = req.body;
    const review = await reviewModel.findByIdAndUpdate(_id,req.body);
    if(!review) return next(new AppError('You Can\'t Edit Review Now , Please Try Again.'));
    if(req.body.rating){
        const product = await productModel.findById(review.productId);
        product.ratingNumber = (product.ratingNumber - review.rating) + req.body.rating;
        product.ratingAvg = ((product.ratingNumber - review.rating) + req.body.rating) / (product.ratingCount);
        await product.save();
    }
    res.status(200).json({message:'success'});
});

export const deleteReview = catchError(async(req,res,next)=>{
    const {_id} = req.query;
    const review = await reviewModel.findOne({_id , userId:req.user._id});
    if(!review) return next(new AppError('You Can\'t Delete Review Now , Please Try Again.'));
    const product = await productModel.findById(review.productId);
    product.ratingNumber -= review.rating;
    product.ratingCount -= 1;
    product.ratingAvg = (product.ratingNumber - rating) / (product.ratingCount-1);
    product.save();
    res.status(200).json({message:'success'});
});

export const getAllProductReviews = catchError(async(req,res,next)=>{
    const {productId} = req.query;
    const apiFeatures = new ApiFeatures( reviewModel.find({productId}) , req.query).paginate().filter().fields().sort();
    const reviews = await apiFeatures.mongooseQuery.populate('createdBy' , 'name profileImage');
    res.status(200).json({message:'success' , reviews});
});

export const getUserReviews = catchError(async(req,res,next)=>{
    const id = req.user._id;
    const reviews = await reviewModel.find({createdBy:id});
    res.status(200).json({message:'success' , reviews});
});
