import { Router } from "express";
import * as endPoints from "./subcategory.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
import { validation } from "../../middleware/validation.js";
import {addSubcategory , editSubcategory} from './subcategory.validation.js';
const subcategryRouter = new Router();

subcategryRouter
  .route("/")
  .post(
    userAuthentication,
    userAuthorization("admin"),
    validation(addSubcategory),
    endPoints.addSubcategory
  )
  .put(
    userAuthentication,
    userAuthorization("admin"),
    validation(editSubcategory),
    endPoints.editSubcategory
  )
  .get(endPoints.listAllSubcategories);

subcategryRouter.delete(
  "/:_id",
  userAuthentication,
  userAuthorization("admin"),
  endPoints.deleteSubcategory
);
export default subcategryRouter;
