import couponModel from "../../../database/models/product.model.js";
import { catchError } from "../../middleware/catch.errors.js";
import { AppError } from "../../utils/response.error.js";
import { ApiFeatures } from "../../utils/api.features.js";

export const createCoupon = catchError(async (req, res, next) => {
  const { code, amount, fromDate, toDate, usageCount } = req.body;
  if (amount < 90)
    return next(new AppError("Amount must be from 1% to 90%", 400));
  const findCoupon = await couponModel.findOne({ code });
  if (findCoupon) return next(new AppError("Coupon code exist", 400));
  const fromDateMoment = parseInt(fromDate.getTime() / 1000);
  const toDateMoment = parseInt(toDate.getTime() / 1000);
  if (fromDateMoment >= toDateMoment) {
    return next(new AppError("Invalid start and end coupon date", 400));
  }
  const coupon = await couponModel.insertMany({
    code,
    fromDate,
    toDate,
    amount,
    createdBy: req.user._id,
    usageCount,
  });
  if (!coupon) return next(new AppError("Try to add coupon again"));
  res.status(200).json({ message: "success", coupon });
});

export const editCoupon = catchError(async (req, res, next) => {
  const { _id } = req.body;
  const coupon = await couponModel.findById(_id);
  if (!coupon) return next(new AppError("Not Found Coupon", 400));
  if (req.body.amount) {
    if (req.body.amount < 90 && req.body.amount > 0)
      coupon.amount = req.body.amount;
    else return next(new AppError("Amount must be from 1% to 90%", 400));
  }
  if (req.body.fromDate && !req.body.toDate) {
    const fromDateMoment = parseInt(req.body.fromDate.getTime() / 1000);
    const toDateMoment = parseInt(coupon.toDate.getTime() / 1000);
    if (fromDateMoment > toDateMoment)
      return next(new AppError("Invalid start coupon date", 400));
    coupon.fromDate = req.body.fromDate;
  }
  if (req.body.toDate && !req.body.fromDate) {
    const fromDateMoment = parseInt(coupon.fromDate.getTime() / 1000);
    const toDateMoment = parseInt(req.body.toDate.getTime() / 1000);
    if (fromDateMoment > toDateMoment)
      return next(new AppError("Invalid end coupon date", 400));
    coupon.toDate = req.body.toDate;
  }
  if (req.body.usageCount) {
    if (req.body.usageCount < coupon.users.length) return next(new AppError("Users counter must be greater than number of users", 400));
    else if(req.body.usageCount == coupon.users.length) coupon.couponStatus = 'expired';
    else coupon.couponStatus = 'valid';
    coupon.usageCount = req.body.usageCount;
  }
  const saveCoupon = await coupon.save();
  res.status(200).json({ message: "success", coupon: saveCoupon });
});

export const deleteCoupon = catchError(async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.id);
  if (!coupon) return next(new AppError("Not Found Coupon", 400));
  res.status(200).json({ message: "success" });
});

export const getCoupons = catchError(async (req, res, next) => {
  let coupons;
  if(req.user.role == 'seller'){
    coupons = await couponModel.find({ couponStatus: "valid" , createdBy: req.user._id});
  }else{
    coupons = await couponModel.find({ couponStatus: "valid" });
  }
  res.status(200).json({ message: "success", coupons });
});

