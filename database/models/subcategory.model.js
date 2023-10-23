import mongoose from "mongoose";

const subcategorySchema = mongoose.Schema({
    name: {
        type: String ,
        minLength:3,
        maxLength: 20,
        required: [true , 'subcategory name required'],
        trim: true
    },
    slug: {
        type: String ,
        lowercase: true
    },
    categoryId:{
        type: mongoose.Types.ObjectId,
        required: [true , 'Category Id required'],
        ref: "category"
    }
},{timestamps: true});

const subcategoryModel = mongoose.model('subcategory' , subcategorySchema);
export default subcategoryModel;