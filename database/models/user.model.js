import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type:String,
        trim:true
    },
    email: {
        type:String,
        unique:true
    },
    password: String,
    passwordChangedAt: Date,
    profileImage: String,
    wishList:[{
        type: mongoose.Types.ObjectId,
        ref: "product",
    }],
    code: String,
    verified:{
        type: Boolean,
        default: false
    },
    phoneNumber:{
        type: String,
    },
    role:{
        type: String,
        enum: ['user' , 'admin' , 'seller'],
        default: 'user'
    }
},{timestamps: true});

const userModel = mongoose.model('user' , userSchema);
export default userModel;
