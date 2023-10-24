import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name : {
        type: String ,
        required: [true , 'product name required'],
        unique: [true , 'Product name is unique'],
        minLength: [3 , 'too short product name'],
        trim: true,
    },
    slug : {
        type: String ,
        lowercase: true
    },
    price: {
        type: Number ,
        required: [true , 'product price required'],
        min : 1,
    },
    discount:{
        type:Number ,
        default: 0
    } , 
    discription: {
        type: String ,
        required: [true , 'product discription required'],
        minLength: [5 , 'too short product discription'],
        trim: true,
    },
    ProductDetails: Object,
    ratingAvg:{
        type: Number ,
        min: 0,
        default: 0
    },
    ratingCount:{
        type: Number ,
        min:0,
        default: 0
    },
    ratingNumber:{
        type:Number,
        min:0,
        default: 0
    },
    quantity: {
        type: Number ,
        required: [true , 'product quantity required'],
        min: 1,
        default: 1
    },
    imageCover: Object,
    images: [Object],
    colors:[String],
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref: "category",
        required: [true , 'product category required'],
    },
    subcategoryId:{
        type: mongoose.Types.ObjectId,
        ref: "subcategory",
        required: [true , 'product subcategory required'],
    },
    brandId:{
        type: mongoose.Types.ObjectId,
        ref: "brand",
        required: [true , 'product brand required'],
    }
},{timestamps: true});

const productModel = mongoose.model('product', productSchema);

export default productModel;