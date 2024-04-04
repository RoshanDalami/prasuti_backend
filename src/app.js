import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express()
console.log(process.env.CORS_ORIGIN,'from env')
app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  
import { UserRouter } from './Routes/user.routes.js';
import { DonorRouter } from './Routes/donor.routes.js';
import { DropdownRoute } from './Routes/dropdown.routes.js';
import {OfficeRouter} from './Routes/office.routes.js'
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use('/api/v1/user',UserRouter)
app.use('/api/v1/donor',DonorRouter)
app.use('/api/v1/dropdown',DropdownRoute)
app.use('/api/v1/office',OfficeRouter)
app.get('/*',(req,res)=>{
    res.status(200).json({message:"Message from app express"})
})


export default app