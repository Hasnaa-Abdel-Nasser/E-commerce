import { Router } from "express";
import * as endPoints from "./category.controller.js";
import { userAuthentication , userAuthorization } from "../../middleware/user.auth.js";
const categoryRouter = new Router();

categoryRouter
  .route("/")
  .post( userAuthentication,userAuthorization("admin"),endPoints.addCategory)
  .put( userAuthentication,userAuthorization("admin"),endPoints.editCategory)
  .get(endPoints.listAllCategories);

categoryRouter.delete('/:_id' , userAuthentication,userAuthorization("admin"),endPoints.deleteCategory);
export default categoryRouter;
