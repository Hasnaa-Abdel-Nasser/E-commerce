import { Router } from "express";
import * as endPoints from "./order.controller.js";
import {
  userAuthentication,
  userAuthorization,
} from "../../middleware/user.auth.js";
import {validation} from '../../middleware/validation.js';
import {createOrder , orderId} from './order.validation.js';
const orderRouter = new Router();

orderRouter.post(
  "/create",
  userAuthentication,
  userAuthorization("user"),
  validation(createOrder),
  endPoints.createOrder
);
orderRouter.delete(
  "/cancel",
  userAuthentication,
  userAuthorization("user"),
  validation(orderId),
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
  userAuthorization("seller"),
  validation(orderId),
  endPoints.orderDelivered
);
export default orderRouter;
