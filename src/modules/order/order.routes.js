import { Router } from "express";
import * as endPoints from "./order.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
const orderRouter = new Router();

orderRouter.post(
  "/create",
  userAuthentication,
  userAuthorization("user"),
  endPoints.createOrder
);
orderRouter.delete(
  "/cancel",
  userAuthentication,
  userAuthorization("user"),
  endPoints.cancelOrder
);

export default orderRouter;
