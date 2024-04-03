import { BabyStatus } from '../Model/dropdownModels/babyStatus.model.js'
import { BabyTransfer } from '../Model/dropdownModels/babyTransfer.model.js'
import {BreastFeeding} from '../Model/dropdownModels/breastFeeding.model.js'
import { Delivery } from '../Model/dropdownModels/delivery.model.js'
import { Ethnicity } from '../Model/dropdownModels/ethnicity.model.js'
import { Gestational } from '../Model/dropdownModels/gestational.model.js'
import { Parity } from "../Model/dropdownModels/parity.model.js"
import { ApiResponse } from '../utils/ApiResponse.js'

export async function getBabyStatus(req,res){
    try {
        const response = await BabyStatus.find({});
        return res.status(200).json(new ApiResponse(200,response,'List generated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}
export async function getBabyTransfer(req,res){
    try {
        const response = await BabyTransfer.find({});
        return res.status(200).json(new ApiResponse(200,response,'List generated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}
export async function getBreastFeeding(req,res){
    try {
        const response = await BreastFeeding.find({});
        return res.status(200).json(new ApiResponse(200,response,'List generated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}
export async function getDelivery(req,res){
    try {
        const response = await Delivery.find({});
        return res.status(200).json(new ApiResponse(200,response,'List generated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}
export async function getEthnicity(req,res){
    try {
        const response = await Ethnicity.find({});
        return res.status(200).json(new ApiResponse(200,response,'List generated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}
export async function getGestational(req,res){
    try {
        const response = await Gestational.find({});
        return res.status(200).json(new ApiResponse(200,response,'List generated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}
export async function getParity(req,res){
    try {
        const response = await Parity.find({});
        return res.status(200).json(new ApiResponse(200,response,'List generated successfully'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}