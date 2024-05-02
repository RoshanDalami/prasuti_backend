import { MilkVolume } from "../Model/volumeOfMilk.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Gestational } from "../Model/dropdownModels/gestational.model.js";
import { DaanDarta } from "../Model/donorDetails.model.js";
import { Delivery } from "../Model/dropdownModels/delivery.model.js";
import {Fiscal} from '../Model/officeSetupModels/fiscal.model.js'
async function RegisterMilkVolume(req, res) {
  const body = req.body;
  const { _id } = await Fiscal.findOne({ status: true });

  const quantityArray = body.collectedMilk.map((item, index) => {
    return parseInt(item.quantity);
  });
  const quantityArrayWithRemaining = body?.collectedMilk?.map((item, index) => {
    return {
      ...item,
      remaining: parseInt(item.quantity),
      quantity: parseInt(item.quantity),
    };
  });
  
  
  const isDateMatch = await MilkVolume.find({$and:[{donorId:body?.donorId,date:body?.date}]})
  console.log(isDateMatch)
  const remaining = quantityArray.reduce((acc, value) => acc + value, 0);
  try {
    const isNewDocument = !body._id;
    const newMilkVolume = isNewDocument
      ? new MilkVolume({
          ...body,
          remaining: remaining,
          totalMilkCollected: remaining,
          collectedMilk: quantityArrayWithRemaining,
          fiscalYear: _id,
        })
      : await MilkVolume.findByIdAndUpdate(
          body._id,
          {
            ...body,
            remaining: remaining,
            totalMilkCollected: remaining,
            collectedMilk: quantityArrayWithRemaining,
          },
          { new: true }
        );
    const savedMilkVolume = await newMilkVolume.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          savedMilkVolume,
          "Volume of milk created successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function GetMilkVolume(req, res) {
  
  try {
    const activeFiscal = await Fiscal.findOne({status:true})
    const response = await MilkVolume.find({});
    // .populate(
    //   "donorId",
    //   "contactNo hosRegNo"
    // );
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Milk list generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkById(req, res) {
  const id = req.params.id;
  try {
    const response = await MilkVolume.findOne({ _id: id }, { __v: 0 });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated by Id"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
}
async function DeleteMilkById(req, res) {
  const id = req.params.id;
  try {
    const response = await MilkVolume.deleteOne({ _id: id });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Milk volume deleted"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkVolumeByGestationalAge(req, res) {
  const gestationalId = req.query.gestationalId;
  try {
    const response = await Gestational.findOne({
      gestationalId: gestationalId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkVolumeByDonor(req, res) {
  const id = req.params.id;
  
  let voluemofMilk = [];
  let donorDetails = {};
  try {
    const response = await MilkVolume.find(
      { donorId: id },
      { createdAt: 0, updatedAt: 0 }
    );
    const individual = await DaanDarta.findOne({ _id: id });

    const modeOfDelivery = await Delivery.find({});
    const modeName = modeOfDelivery.filter(
      (item) => item.deliveryId === individual?.modeOfDelivery
    )?.[0]?.deliveryName;
    if (response.length <= 0) {
      donorDetails = {
        donorRegNo: individual?.donorRegNo,
        donorName: individual?.donorName,
        donorAge: individual?.donorAge,
        address: individual?.address,
        contactNo: individual?.contactNo,
        modeOfDelivery: modeName,
        donotedMilkList: [],
      };
    }
    response.forEach((items) => {
      const array = items.collectedMilk.map((item) => {
        return { ...item._doc, date: items.date };
      });
      voluemofMilk.push(...array);
      donorDetails = {
        donorRegNo: individual?.donorRegNo,
        donorName: individual?.donorName,
        donorAge: individual?.donorAge,
        address: individual?.address,
        contactNo: individual?.contactNo,
        modeOfDelivery: modeName,
        donotedMilkList: voluemofMilk,
      };
    });
    return res
      .status(200)
      .json(new ApiResponse(200, donorDetails, "List generated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkListByDonor(req,res){
  const {donorId} = req.params; 
try {
  const response = await MilkVolume.find({donorId:donorId, remaining:{$gt:0}});
  console.log(response)
  return res.status(200).json(new ApiResponse(200,response,"List generated according to donorId"))
} catch (error) {
  console.log(error);
  return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
}
}
export {
  RegisterMilkVolume,
  GetMilkVolume,
  GetMilkVolumeByGestationalAge,
  GetMilkVolumeByDonor,
  GetMilkById,
  DeleteMilkById,
  GetMilkListByDonor
};
