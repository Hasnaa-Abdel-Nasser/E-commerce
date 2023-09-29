import { Router } from "express";
import * as endPoints from "./product.controller.js";
import { MultiFile } from "../../utils/files.uploads.js";
const productRouter = new Router();
let ImageArray = [
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ];

productRouter
  .route("/")
  .post(MultiFile(ImageArray),endPoints.newProduct)
  .put(endPoints.editProduct)
  .delete(endPoints.deleteProduct)
  .get(endPoints.listAllProducts);

productRouter.patch('/wishlist',endPoints.addProductToWishlist)
productRouter.get("/:id", endPoints.getProductById);
productRouter.patch('/wishlist/remove' , endPoints.removeProductFromWishlist);
export default productRouter;
