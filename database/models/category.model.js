import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name : {
        type: String ,
        required: [true , 'category name required'],
        trim: true
    },
    slug : {
        type: String ,
        lowercase: true
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("category", categorySchema);
export default categoryModel;