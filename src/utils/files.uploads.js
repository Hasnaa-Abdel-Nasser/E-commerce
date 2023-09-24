import multer from "multer";
import {AppError} from './response.error.js'
import cloudinary from "./cloudinary.js";

const Upload = ()=>{
  const storage = multer.diskStorage({});
  function fileFilter(req , file , cb){
    if(file.mimetype.startsWith('image')){
      cb(null , true)
    }else{
      cb(new AppError('image Only' , 400) , false)
    }
  }
  return multer({ storage , fileFilter});
}
export const SingleFile = (fieldName ) => {
  return Upload().single(fieldName)
};

export const MultiFile = (arrayOfFields ) => {
  return Upload().fields(arrayOfFields)
};

export const uploadToCloudinary = async(filePath, folder)=> {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return { secure_url: result.secure_url, public_id: result.public_id };
}