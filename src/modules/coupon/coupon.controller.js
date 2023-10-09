import couponModel from "../../../database/models/coupon.model.js";
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import { ApiFeatures } from "../../utils/api.features.js";

export const createCoupon = catchError(async (req, res, next) => {
  const { code, amount, fromDate, toDate, usageCount } = req.body;
  if (amount > 90 || req.body.amount <= 0)
    return next(new AppError("Amount must be from 1% to 90%", 400));
  const findCoupon = await couponModel.findOne({ code });
  if (findCoupon) return next(new AppError("Coupon code exist", 400));
  if (convertDate(fromDate) < convertDate(new Date()) ||
      convertDate(fromDate) >= convertDate(toDate)) {
    return next(new AppError("Invalid start or end coupon date", 400));
  }
  const coupon = await couponModel.insertMany({code,fromDate,toDate,amount,createdBy: req.user._id,usageCount,});
  if (!coupon) return next(new AppError("Try to add coupon again"));
  res.status(200).json({ message: "success", coupon });
});

export const editCoupon = catchError(async (req, res, next) => {
  const { _id } = req.body;
  const coupon = await couponModel.findById(_id);
  if (!coupon) return next(new AppError("Not Found Coupon", 400));

  if (req.body.amount) {
    if (req.body.amount > 90 || req.body.amount <= 0)
      coupon.amount = req.body.amount;
    else return next(new AppError("Amount must be from 1% to 90%", 400));
  }

  if (req.body.fromDate) {
    if (convertDate(req.body.fromDate) > convertDate(coupon.toDate) ||
        convertDate(req.body.fromDate) < convertDate(new Date) ){
          return next(new AppError("Invalid start coupon date", 400));
        }
    coupon.fromDate = req.body.fromDate;
  }

  if (req.body.toDate) {
    if (convertDate(req.body.toDate) <= convertDate(coupon.fromDate)){
        return next(new AppError("Invalid end coupon date", 400));
    }
    coupon.toDate = req.body.toDate;
  }

  if (req.body.usageCount >= 0) {
    if (req.body.usageCount <= coupon.users.length)
      coupon.couponStatus = "expired";
    else 
      coupon.couponStatus = "valid";
    coupon.usageCount = req.body.usageCount;
  }

  const saveCoupon = await coupon.save();
  res.status(200).json({ message: "success", coupon: saveCoupon });
});

export const deleteCoupon = catchError(async (req, res, next) => {
  const coupon = await couponModel.findByIdAndDelete(req.params.id);
  if (!coupon) return next(new AppError("Not Found Coupon", 400));
  res.status(200).json({ message: "success" });
});

export const getCoupons = catchError(async (req, res, next) => {
  let coupons;
  if (req.user.role == "seller") {
    coupons = await couponModel.find({
      couponStatus: "valid",
      createdBy: req.user._id,
    });
  } else {
    coupons = await couponModel.find({ couponStatus: "valid" });
  }
  res.status(200).json({ message: "success", coupons });
});

export const convertDate = (date)=>{
  const result = new Date(date);
  return parseInt(result.getTime() / 1000);
}