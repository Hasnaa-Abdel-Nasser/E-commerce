import { Router } from "express";
import * as endPoints from "./category.controller.js";
import { userAuthentication , userAuthorization } from "../../middleware/user.auth.js";
import {validation} from '../../middleware/validation.js';
import {addCategory , editCategory} from './category.validation.js'
const categoryRouter = new Router();

categoryRouter
  .route("/")
  .post( userAuthentication,
    userAuthorization("admin"),
    validation(addCategory),
    endPoints.addCategory)
  .put( userAuthentication,
    userAuthorization("admin"),
    validation(editCategory),
    endPoints.editCategory)
  .get(endPoints.listAllCategories);

categoryRouter.delete('/:_id' , 
              userAuthentication,
              userAuthorization("admin"),
              endPoints.deleteCategory);
export default categoryRouter;
