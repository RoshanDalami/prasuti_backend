import {MilkVolume} from '../Model/volumeOfMilk.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

async function RegisterMilkVolume(req,res){
    const body =  req.body;
  
  const quantityArray = body.collectedMilk.map((item,index)=>{
    return(
      parseInt(item.quantity)
    )
  })
  const remaining = quantityArray.reduce((acc,value)=>acc+value,0)
    try {
        const isNewDocument = !body._id;
        const newMilkVolume = isNewDocument
          ? new MilkVolume({ ...body,remaining:remaining,totalMilkCollected:remaining })
          : await MilkVolume.findByIdAndUpdate(
              body._id,
              { ...body,remaining:remaining,totalMilkCollected:remaining},
              { new: true }
            );
        const savedMilkVolume = await newMilkVolume.save();
        return res.status(200).json(new ApiResponse(200,savedMilkVolume,'Volume of milk created successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,'Internal Server Error'))
    }
}

async function GetMilkVolume(req,res){
    try {
        const response = await MilkVolume.find({})
        // .populate(
        //   "donorId",
        //   "contactNo hosRegNo"
        // );
        return res.status(200).json(new ApiResponse(200,response,"Milk list generated successfully"))
        
      } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,'Internal Server Error'))
        
      }
}
async function GetMilkVolumeByGestationalAge(req,res){
    try {
        
    } catch (error) {
        return res.status
    }
}

export {RegisterMilkVolume,GetMilkVolume}