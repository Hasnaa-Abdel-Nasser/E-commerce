import userRouter from "./user/user.routes.js";
import productRouter from "./product/product.routes.js";
import categoryRouter from "./category/category.routes.js";
import subcategoryRouter from "./subcategory/subcategory.routes.js";
import brandRouter from "./brand/brand.routes.js";
import couponRouter from "./coupon/coupon.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import reviewRouter from "./review/review.routes.js";
import { AppError } from '../utils/response.error.js';

export function routes(app) {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/subcategory", subcategoryRouter);
  app.use("/api/v1/brand", brandRouter);
  app.use("/api/v1/coupon", couponRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/order", orderRouter);
  app.use("/api/v1/review", reviewRouter);
  app.all("*", (req, res, next) => {
    next(new AppError("Not Found", 404));
  });
  //Global error
  app.use((err, req, res, next) => {
    res.status(err.statusCode).json({ message: err.message });
  });
}
