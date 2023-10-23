import express from 'express';
import connect from './database/dbConnection.js';
import cors from 'cors';
import morgan from 'morgan';
import {routes} from './src/modules/index.routes.js'
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use(morgan('dev')) // request logger middelware 
routes(app);
app.listen(port , ()=>{
    console.log('listening on port ' + port);
});
