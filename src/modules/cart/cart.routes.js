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
  .put(
    userAuthentication, 
    userAuthorization("user"), 
    endPoints.removeFromCart)
  .patch(
    userAuthentication,
    userAuthorization("user"),
    endPoints.updateQuantity
  )
  .patch(
    userAuthentication,
    userAuthorization("user"),
    endPoints.applyCoupon
  );

export default cartRouter;
