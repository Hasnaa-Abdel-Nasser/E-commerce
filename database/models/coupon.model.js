import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        unique: [true , 'Coupon code exist'],
        required: [true , 'Coupon code required'],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    users:[{
        type: mongoose.Types.ObjectId,
        ref: "user",
    }],
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true
    },
    couponStatus: {
        type: String,
        default: 'valid',
        enum: ['valid' , 'expired']
    },
    usageCount: {
        type: Number,
        required: true,
        default: 0
    }
},{timestamps: true});

const couponModel = mongoose.model('coupon' , couponSchema);

export default couponModel;