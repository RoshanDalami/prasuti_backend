import { DaanDarta } from "../Model/donorDetails.model.js";
import { District } from "../Model/officeSetupModels/district.model.js";
import { Palika } from "../Model/officeSetupModels/palika.model.js";
import { State } from "../Model/officeSetupModels/state.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export async function RegisterDonor(req,res){
    const body =  req.body;
  try {
    const latestDaanDarta = await DaanDarta.findOne(
      {},
      {},
      { sort: { donorRegNo: -1 } }
    );

    let newDonorRegNo = "PMWH-001";

    // const state = State.findOne({statedId : body?.address?.stateId})
    // const district = District.findOne({districtId:body.address.districtId})
    // const palika = Palika.findOne({palikaId:body.address.palikaId})
    

    if (latestDaanDarta) {
      const lastDonorRegNo = latestDaanDarta.donorRegNo?.split("-")[1];
      const numericPart = parseInt(lastDonorRegNo, 10);
      newDonorRegNo = 'PMWH-' + (numericPart + 1).toString().padStart(3, "0");
    }

    let newDaanDarta = new DaanDarta({
      
      ...body,
      donorRegNo: newDonorRegNo,
    });

    // ===============================================================================================
    // yadi serologyRecords positive aayo vane isSerologyPositive = true baschha
    if (newDaanDarta.serologyRecords.hiv === true) {
      newDaanDarta.isSerologyPositive = true;
      newDaanDarta.remarks = "HIV Positive";
    } else if (newDaanDarta.serologyRecords.hbsag === true) {
      newDaanDarta.isSerologyPositive = true;
    } else if (newDaanDarta.serologyRecords.vdrl === true) {
      newDaanDarta.isSerologyPositive = true;
    } else {
      // yadi serologyRecords negative  aayo vane isSerologyPositive = false baschha
      newDaanDarta.isSerologyPositive = false;
    }

    if (newDaanDarta.isSerologyPositive === true) {
      newDaanDarta.isDonorActive = false;
    } else {
      newDaanDarta.isDonorActive = true;
    }

    if (newDaanDarta.isSerologyPositive === true) {
      await newDaanDarta.save();
      return res.status(200).json(new ApiResponse(200,null,"Serology Positive she can't donate milk" ))
    }

    // ===============================================================================================

    if (
      newDaanDarta.verbalExamination.acuteInfection === true ||
      newDaanDarta.verbalExamination.chronicInfection === true ||
      newDaanDarta.verbalExamination.cancerTreatmentWithinThreeYears === true ||
      newDaanDarta.verbalExamination.autoImmuneDisease === true ||
      newDaanDarta.verbalExamination.coughMoreThanTwoWeeks === true ||
      newDaanDarta.verbalExamination.chickenpox === true ||
      newDaanDarta.verbalExamination.stdLastOneYear === true ||
      newDaanDarta.verbalExamination.medCancerAntisicotikRadioactiveThyroid ===
        true ||
      newDaanDarta.verbalExamination.transplantAndBloodTaken === true ||
      newDaanDarta.verbalExamination.BadLifeStyle === true
    ) {
      newDaanDarta.verbalStatus = true;
      newDaanDarta.remarks =
        "She can’t donation milk right now she has to take tests after ………………… Days ";
    } else {
      newDaanDarta.verbalStatus = false;
    }

    if (newDaanDarta.verbalStatus === true) {
      await newDaanDarta.save();

      return res.status(200).json(new ApiResponse(200,null,"she can't donate milk right now !" ))
    }

    // ===============================================================================================

    if (
      newDaanDarta.donorPhysicalExamination.mastitis === true ||
      newDaanDarta.donorPhysicalExamination.localLesions === true ||
      newDaanDarta.donorPhysicalExamination.fugalInNippleAreola === true ||
      newDaanDarta.donorPhysicalExamination.herpesZoster === true
    ) {
      newDaanDarta.physicalStatus = true;
      newDaanDarta.remarks =
        " She can’t donation milk right now she has to take tests after ………………… Days";
    } else {
      newDaanDarta.physicalStatus = false;
    }

    if (newDaanDarta.physicalStatus === true) {
      await newDaanDarta.save();
      return res.status(200).json(new ApiResponse(200,null,"she can't donate milk right now !" ))
      
    }

    // ===============================================================================================	  if (newDaanDarta.serologyRecords.hiv === true) {
    const savedDaanDarta = await newDaanDarta.save();
    return res.status(200).json(new ApiResponse(200,savedDaanDarta,"Donor Created Successfully"))
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
   
  }
}

export async function GetDonor(req,res){
    try {
        const response = await DaanDarta.find({},{__v:0});
        return res.status(200).json(new ApiResponse(200,response,"Donor List Generated Successfully"))
        
    } catch (error) {
        console.log(error)
        return res.status(200).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}