import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    comment : {
        type: String ,
        required: [true , 'Comment required'],
        trim: true
    },
    rating : {
        type: Number ,
        required: [true , 'Rating Number required'],
        min: 1,
        max: 5
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true , 'User Id required'],
    },
    productId :{
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: [true , 'Product Id required'],
    },
    orderId :{
        type: mongoose.Types.ObjectId,
        ref: "order",
        required: [true , 'Order Id required'],
    }
},{timestamps: true});

const reviewModel = mongoose.model('review' , reviewSchema);

export default reviewModel;