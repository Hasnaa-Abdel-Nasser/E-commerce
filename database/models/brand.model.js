import mongoose from "mongoose";

const brandSchema = mongoose.Schema({
    name : {
        type: String ,
        required: [true , 'brand name required'],
        trim: true
    },
    slug : {
        type: String ,
        lowercase: true
    },
    logo: Object
},{timestamps: true});

const brandModel = mongoose.model('brand' , brandSchema);

export default brandModel;