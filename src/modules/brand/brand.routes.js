import { Router } from "express";
import * as endPoints from "./brand.controller.js";
import { SingleFile } from "../../utils/files.uploads.js";

const brandRouter = new Router();

brandRouter
  .route("/")
  .post(SingleFile('logo'),endPoints.addBrand)
  .patch(endPoints.editBrandName)
  .get(endPoints.listAllBrands);

brandRouter.patch('/logo' , SingleFile('logo'), endPoints.editBrandLogo);
brandRouter.delete('/:_id' ,endPoints.deleteBrand);
export default brandRouter;
