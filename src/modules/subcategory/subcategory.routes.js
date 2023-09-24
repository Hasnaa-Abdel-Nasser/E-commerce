import { Router } from "express";
import * as endPoints from "./subcategory.controller.js";
const subcategryRouter = new Router();

subcategryRouter
  .route("/")
  .post(endPoints.addSubcategory)
  .put(endPoints.editSubcategory)
  .get(endPoints.listAllSubcategories);

subcategryRouter.delete('/:_id' ,endPoints.deleteSubcategory);
export default subcategryRouter;
