import { BabyDetail } from "../Model/baby.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { MilkRequsition } from "../Model/requistion.model.js";
import { Gestational } from "../Model/dropdownModels/gestational.model.js";
import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
async function createBabyDetail(req, res) {
  try {
    const body = req.body;
    const { _id } = await Fiscal.findOne({ status: true });

    if (!body) {
      return res.status(404).json(new ApiResponse(404, null, "Bad Request"));
    }

    const newBaby = new BabyDetail({
      ...body,
      milkConsumed: 0,
      milkConsumedToday: 0,
      fiscalYear: _id,
    });
    const savedBaby = await newBaby.save();
    return res
      .status(200)
      .json(new ApiResponse(200, savedBaby, "Internal Server Error"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
//get
async function getBabyDetail(req, res) {
  try {
    const response = await BabyDetail.find({}, { __v: 0 });
    const milkDetail = [];
    const array = await Promise.all(
      response.map(async (items) => {
        const babyDetails = await MilkRequsition.find({ babyId: items._id });

        const finalArray = babyDetails.map((item) => {
          return { ...items._doc, milkDetail: item?.requisitedMilk };
        });
        milkDetail.push(...finalArray);
        // return { ...item._doc, milkDetail: babyDetails?.requisitedMilk , milkConsumed: babyDetails?.requisitedMilk.map((item)=>{return item.quantity}).reduce((acc,amount)=>acc+amount,0) || 0  };
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Baby details generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
//getbyId
async function getBabyDetailId(req, res) {
  const { id } = req.params;

  let babyList = {};
  const feedList = [];
  try {
    const individual = await BabyDetail.findOne({ _id: id });
    const response = await MilkRequsition.find({ babyId: id });
    const gestational = await Gestational.find({});
    const gestationalName = gestational.filter(
      (item) => item.gestationalId === individual?.gestationalAge
    )?.[0]?.gestationalName;
    if (response.length <= 0) {
      babyList = {
        babyName: individual?.babyName,
        ipNumber:individual?.ipNumber,
        dateOfBaby: individual?.dateOfBaby,
        engDateOfBaby: individual?.engDateOfBaby,
        gestationalAge: individual?.gestationalAge,
        babyWeight: individual?.babyWeight,
        milkComsumedDetail: [],
      };
    }

    response.forEach((items) => {
      const array = items.requisitedMilk.map((item, index) => {
        return { ...item._doc, feedingDate: items.feedingDate };
      });
      feedList.push(...array);
      babyList = {
        babyName: individual?.babyName,
        dateOfBaby: individual?.dateOfBaby,
        ipNumber:individual?.ipNumber,
        engDateOfBaby: individual?.engDateOfBaby,
        gestationalAge: individual?.gestationalAge,
        babyWeight: individual?.babyWeight,
        milkComsumedDetail: feedList,
      };
    });
    return res
      .status(200)
      .json(new ApiResponse(200, babyList, "Baby List generated Successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function updateBabyStatus (req,res){
  try {
    const {id} = req.params;
    const getBaby = await BabyDetail.findOne({_id:id});
    if(!getBaby) return res.status(400).json(new ApiResponse(400,null,"No baby exist with this id"))
    let status 
    if(getBaby){
      status = getBaby?.status;
    }
    console.log(getBaby?.status)
    const resposne = await BabyDetail.findOneAndUpdate({_id:id},{
      $set:{
        status: !getBaby?.status
      }
    })
    return res.status(200).json(new ApiResponse(200,resposne,"status updated"))
  } catch (error) {
    console.log(error)
    return res.status(500).json(new ApiResponse(500,null,"Internal  Server Error"))
  }
}
export { createBabyDetail, getBabyDetail, getBabyDetailId,updateBabyStatus };
