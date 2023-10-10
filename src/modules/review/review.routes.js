import { Router } from "express";
import * as endPoints from "./review.controller.js";
import { userAuthentication , userAuthorization } from "../../middleware/user.auth.js";
const reviewRouter = new Router();

reviewRouter.route("/")
export default reviewRouter;
