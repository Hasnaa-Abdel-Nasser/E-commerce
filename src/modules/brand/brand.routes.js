import { Router } from "express";
import * as endPoints from "./brand.controller.js";
import { SingleFile } from "../../utils/files.uploads.js";
import { userAuthentication , userAuthorization } from "../../middleware/user.auth.js";
const brandRouter = new Router();

brandRouter
  .route("/")
  .post( userAuthentication,userAuthorization("admin"),SingleFile('logo'),endPoints.addBrand)
  .patch( userAuthentication,userAuthorization("admin"),endPoints.editBrandName)
  .get(endPoints.listAllBrands);

brandRouter.patch('/logo' ,  userAuthentication,userAuthorization("admin"),SingleFile('logo'), endPoints.editBrandLogo);
brandRouter.delete('/:_id' , userAuthentication,userAuthorization("admin"),endPoints.deleteBrand);
export default brandRouter;
