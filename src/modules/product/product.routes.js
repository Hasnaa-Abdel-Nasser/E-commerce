import { Router } from "express";
import * as endPoints from "./product.controller.js";
import { MultiFile } from "../../utils/files.uploads.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
import {validation} from '../../middleware/validation.js';
import {newProduct , editProduct,wishList , product} from './product.validation.js'
const productRouter = new Router();
let ImageArray = [
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
];

productRouter
  .route("/")
  .post(  //New Product
    userAuthentication,
    userAuthorization("admin", "seller"),
    MultiFile(ImageArray),
    validation(newProduct),
    endPoints.newProduct
  )
  .put(  // Edit Product
    userAuthentication,
    userAuthorization("admin", "seller"),
    validation(editProduct),
    endPoints.editProduct
  )
  .delete( 
    userAuthentication,
    userAuthorization("admin", "seller"),
    endPoints.deleteProduct
  )
  .get(endPoints.listAllProducts);

productRouter.patch(
  "/wishlist",
  userAuthentication,
  userAuthorization("user"),
  validation(wishList),
  endPoints.addProductToWishlist
);
productRouter.patch(
  "/wishlist/remove",
  userAuthentication,
  userAuthorization("user"),
  validation(wishList),
  endPoints.removeProductFromWishlist
);
productRouter.get(  // Get One Product
  "/:id",
  endPoints.getProductById
);

export default productRouter;
