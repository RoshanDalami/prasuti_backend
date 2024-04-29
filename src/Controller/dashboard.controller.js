import { ApiResponse } from "../utils/ApiResponse.js";
import { BabyDetail } from "../Model/baby.model.js";
import { response } from "express";
import { DaanDarta } from "../Model/donorDetails.model.js";
async function GetTotalBaby(req,res){
    try {
        const response = await BabyDetail.find({});
        const totalBaby = response.length;
        return res.status(200).json(new ApiResponse(200,totalBaby,"Number of baby "))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,'Internal Server Errro'))
    }
}

async function GetTotalDonor(req,res){
    try {
        const response = await DaanDarta.find({});
        
    } catch (error) {
        
    }
}

export {
    GetTotalBaby
}

