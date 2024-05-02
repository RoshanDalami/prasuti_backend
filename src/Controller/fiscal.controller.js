import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function createFiscal(req, res) {
  try {
    const { fiscalYear, startYear, endYear, startDate, endDate, status ,_id } =
      req.body;
      if(status === true){
        await Fiscal.updateMany({$set:{status:false}})
      }
      if(_id){

        const response = await Fiscal.findOneAndUpdate({_id:_id},{fiscalYear, startYear, endYear, startDate, endDate, status},{new:true})
        return res.status(200).json(new ApiResponse(200,response,'Fiscal year updated successfully'))
      }
    const newFiscal = new Fiscal({
      fiscalYear,
      startYear,
      endYear,
      startDate,
      endDate,
      status,
    });
    await newFiscal.save();
    return res
      .status(200)
      .json(new ApiResponse(200, newFiscal, "Fiscal Created Successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
}


export async function getFiscal(req, res) {
  try {
    const response = await Fiscal.find();
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Office generated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function getFiscalYearById(req,res){
  try {
    const {id} = req.params
    const response = await Fiscal.findOne({_id:id});
    return res.status(200).json(new ApiResponse(200,response,"Fiscal year with id"))
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))

  }
}

export async function updateFiscalYearStatus(req,res){
  try {
    const {id} = req.params;
      const prevState = await Fiscal.findOne({_id:id}).status;
      await Fiscal.updateMany({$set:{status:false}})
    
    const response = await Fiscal.findOneAndUpdate({_id:id},{
      $set:{status:!prevState}
    },{new:true})
    return res.status(200).json(new ApiResponse(200,response,"Status Updated Successfully"))
  } catch (error) {
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
  }
}
