import { MilkRequsition } from '../Model/requistion.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {BabyDetail} from '../Model/baby.model.js'
async function RegisterMilkRequsition(req,res){
    const body = req.body;
  // console.log(body,'response')

  try {
    const { _id } = body;
    if (_id) {
      const response = await MilkRequsition.findByIdAndUpdate(
        _id,
        { ...body },
        { new: true }
      );
      return res.status(200).json(new ApiResponse(200,response,'Milk requsition updated'))

    }
    body?.requisitedMilk?.forEach(async(items)=>{
      const poolingId = items.batchNumber.split('/')?.[0]
      const response = await Bottle.findOne({poolingId:poolingId}).then((doc)=>{
        const item = doc.bottleList.id(items.bottleName.split('/')?.[0])
        item.remainingVoluem = item.volume - items.quantity;
        doc.save()
      })
      
    })
    const babyDetail = await BabyDetail.findOne({_id:body?.babyId})
    const consumnedMilk = body?.requisitedMilk?.map((item)=>{return parseInt(item?.quantity)}).reduce((acc,amount)=>acc + amount ,0) + babyDetail?.milkConsumed
    const newMilkRequsition = new MilkRequsition(body);
    const response = await newMilkRequsition.save();
     await BabyDetail.findOneAndUpdate({_id:body?.babyId},{
      $set:{milkConsumed:consumnedMilk}
    });
    
        return res.status(200).json(new ApiResponse(200,body,'Milk requestion registered successfully'))

  } catch (error) {
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
  }
}

async function GetMilkRequsition(req,res){
    try {
        const response = await MilkRequsition.find(
          {},
          { __v: 0, createdAt: 0, updatedAt: 0 }
        );
        return res.status(200).json(new ApiResponse(200,response,"List generated successfully"))

      } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
      }
}

async function GetMilkRequsitionById(req,res){
    const id = req.params.id;
  try {
    if (!id) {
        return res.status(400).json(new ApiResponse(400,null,"Id is undefined"))
      
    }
    const response = await MilkRequsition.findOne({ _id: id });
    return res.status(200).json(new ApiResponse(200,response,'List generated by id'))
   
  } catch (error) {
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    
  }
}
async function DeleteMilkRequsition(req,res){
    const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json(new ApiResponse(400,null,"Id is undefined"));
    }
    const response = await MilkRequsition.deleteOne({ _id: id });
    return res.status(200).json(new ApiResponse(200,response,"Milk requsition deleted successfully"))
   
  } catch (error) {
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
  }
}

export {RegisterMilkRequsition,GetMilkRequsition,GetMilkRequsitionById,DeleteMilkRequsition}