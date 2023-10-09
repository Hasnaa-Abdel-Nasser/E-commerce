import { Router } from "express";
import * as endPoints from "./cart.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
const cartRouter = new Router();

cartRouter
  .route("/")
  .put(
    userAuthentication,
    userAuthorization("user"), 
    endPoints.addToCart)
  .patch(
    userAuthentication,
    userAuthorization("user"),
    endPoints.updateQuantity
  );

cartRouter.put(
  '/:id',
  userAuthentication,
  userAuthorization("user"), 
  endPoints.removeFromCart);

cartRouter.patch(
  '/coupon',
  userAuthentication,
  userAuthorization("user"),
  endPoints.applyCoupon
);

export default cartRouter;
