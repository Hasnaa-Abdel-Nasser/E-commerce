import { Router } from "express";
import * as endPoints from "./subcategory.controller.js";
import { userAuthentication , userAuthorization } from "../../middleware/user.auth.js";
const subcategryRouter = new Router();

subcategryRouter
  .route("/")
  .post( userAuthentication,userAuthorization("admin"),endPoints.addSubcategory)
  .put( userAuthentication,userAuthorization("admin"),endPoints.editSubcategory)
  .get(endPoints.listAllSubcategories);

subcategryRouter.delete('/:_id' , userAuthentication,userAuthorization("admin"),endPoints.deleteSubcategory);
export default subcategryRouter;
