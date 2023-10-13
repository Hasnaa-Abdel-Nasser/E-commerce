import { Router } from "express";
import * as endPoints from "./review.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
const reviewRouter = new Router();

reviewRouter
  .route("/")
  .post(
    userAuthentication, 
    userAuthorization("user"), 
    endPoints.createReview)
  .put(
    userAuthentication, 
    userAuthorization("user"), 
    endPoints.editReview)
  .delete(
    userAuthentication,
    userAuthorization("user", "admin"),
    endPoints.deleteReview
  )
  .get(
    userAuthentication,
    userAuthorization("user", "admin"),
    endPoints.getAllProductReviews
  );
export default reviewRouter;
