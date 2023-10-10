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
orderRouter.get(
  "/listAll",
  userAuthentication,
  userAuthorization("user"),
  endPoints.getUserOrders
);
orderRouter.get(
  "/data",
  userAuthentication,
  userAuthorization("admin"),
  endPoints.getAllOrders
);
orderRouter.patch(
  "/delivered",
  userAuthentication,
  userAuthorization("seller" , "seller"),
  endPoints.orderDelivered
);
export default orderRouter;
