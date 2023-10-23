import { Router } from "express";
import * as endPoints from "./review.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
import {validation} from '../../middleware/validation.js';
import {createReview , editReview} from './review.validation.js';
const reviewRouter = new Router();

reviewRouter
  .route("/")
  .post(
    userAuthentication, 
    userAuthorization("user"), 
    validation(createReview),
    endPoints.createReview)
  .put(
    userAuthentication, 
    userAuthorization("user"), 
    validation(editReview),
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
