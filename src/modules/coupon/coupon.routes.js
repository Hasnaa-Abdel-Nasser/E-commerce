import { Router } from "express";
import * as endPoints from "./coupon.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
const couponRouter = new Router();

couponRouter
  .route("/")
  .post(
    userAuthentication,
    userAuthorization("admin", "seller"),
    endPoints.createCoupon
  )
  .put(
    userAuthentication,
    userAuthorization("admin", "seller"),
    endPoints.editCoupon
  )
  .delete(
    userAuthentication,
    userAuthorization("admin", "seller"),
    endPoints.deleteCoupon
  )
  .get(
    userAuthentication,
    userAuthorization("admin" , "seller"),
    endPoints.getCoupons
  )

export default couponRouter;