import { Router } from "express";
import * as endPoints from "./cart.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
import {validation} from '../../middleware/validation.js';
import {cart , applyCoupon} from './cart.validation.js';
const cartRouter = new Router();

cartRouter
  .route("/")
  .put(
    userAuthentication,
    userAuthorization("user"), 
    validation(cart),
    endPoints.addToCart)
  .patch(
    userAuthentication,
    userAuthorization("user"),
    validation(cart),
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
  validation(applyCoupon),
  endPoints.applyCoupon
);

export default cartRouter;
