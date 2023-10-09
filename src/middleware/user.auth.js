import Jwt from "jsonwebtoken";
import userModel from "../../database/models/user.model.js";
import { AppError } from "../utils/response.error.js";
import { catchError } from "./catch.errors.js";
import * as dotenv from "dotenv";
dotenv.config();
export const userAuthentication = catchError(async (req, res, next) => {
  const token = req.header("token");
  if (!token) return next(new AppError("Token expired", 401));
  Jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    } else {
      let user = await userModel.findById(decoded.id);
      if (!user) return next(new AppError("Invalid Token", 401));
      if(user.passwordChangedAt){
        let passwordChangedAt = parseInt(user.passwordChangedAt.getTime() / 1000);
        if (passwordChangedAt > decoded.iat)
        return next(new AppError("Invalid Token", 401));
      }
      req.user = user;
      next();
    }
  });
});

export const userAuthorization = (...roles)=>{
  return catchError(async (req ,res, next)=>{
    if(!roles.includes(req.user.role))  // To check Authorization
      return next(new AppError("Can't Access to This Point", 401));
    next();
  });
}
