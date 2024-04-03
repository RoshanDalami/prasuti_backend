import express from 'express';

const app = express()
import { UserRouter } from './Routes/user.routes.js';
import { DonorRouter } from './Routes/donor.routes.js';
import { DropdownRoute } from './Routes/dropdown.routes.js';
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use('/api/v1/user',UserRouter)
app.use('/api/v1/donor',DonorRouter)
app.use('/api/v1/dropdown',DropdownRoute)
app.get('/*',(req,res)=>{
    res.status(200).json({message:"Message from app express"})
})


export default app