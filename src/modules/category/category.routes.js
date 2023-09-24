import { Router } from "express";
import * as endPoints from "./category.controller.js";
const categoryRouter = new Router();

categoryRouter
  .route("/")
  .post(endPoints.addCategory)
  .put(endPoints.editCategory)
  .get(endPoints.listAllCategories);

categoryRouter.delete('/:_id' ,endPoints.deleteCategory);
export default categoryRouter;
