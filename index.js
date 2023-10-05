import express from 'express';
import connect from './database/dbConnection.js';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './src/modules/user/user.routes.js';
import productRouter from './src/modules/product/product.routes.js';
import categoryRouter from './src/modules/category/category.routes.js';
import subcategoryRouter from './src/modules/subcategory/subcategory.routes.js';
import brandRouter from './src/modules/brand/brand.routes.js';
import couponRouter from './src/modules/coupon/coupon.routes.js';
import cartRouter from './src/modules/cart/cart.routes.js';

import { AppError } from './src/utils/response.error.js';
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use(morgan('dev')) // request logger middelware 
app.use('/api/v1/user' , userRouter);
app.use('/api/v1/product' , productRouter);
app.use('/api/v1/category' , categoryRouter);
app.use('/api/v1/subcategory' , subcategoryRouter);
app.use('/api/v1/brand' , brandRouter);
app.use('/api/v1/coupon' , couponRouter);
app.use('/api/v1/cart' , cartRouter);

app.all('*',(req , res , next)=>{
    next(new AppError('Not Found' , 404));
});
//Global error
app.use((err , req , res , next)=>{
    res.status(err.statusCode).json({message: err.message});
})
app.listen(port , ()=>{
    console.log('listening on port ' + port);
});
