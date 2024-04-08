import { DaanDarta } from "../Model/donorDetails.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { MilkVolume } from "../Model/volumeOfMilk.model.js";
import {Pasteurization} from '../Model/pasteurization.model.js';
import { MilkRequsition } from "../Model/requistion.model.js";
async function SearchDonor(req,res){
const {gestationalAge,donorName,registerDate}= req.query;
try {
    let response ;
    if(!donorName && !registerDate ){

        response = await DaanDarta.find({gestationalAge:gestationalAge});
    }else if(!gestationalAge && !registerDate){
        response = await DaanDarta.find({donorName:donorName});

    }else if (!gestationalAge && !donorName){
        response = await DaanDarta.find({date:registerDate})
    }
    else if (!registerDate){
        response = await DaanDarta.find({$and:[{gestationalAge:gestationalAge,donorName:donorName}]})
    }
    else if (!donorName){
        response = await DaanDarta.find({$and:[{gestationalAge:gestationalAge,date:registerDate}]})
    }
    return res.status(200).json(new ApiResponse(200,response,'list generated'))
} catch (error) {
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
}
}

async function SearchMilkVolume (req,res){
    const {gestationalAge , volumeDate} = req.query;
    try {
            let response ;
            if(!gestationalAge){
                 response = await MilkVolume.find({date:volumeDate});
                return res.status(200).json(new ApiResponse(200,response,"List generated according to voluemDate"))
            }else if(!volumeDate){
                 response = await MilkVolume.find({gestationalAge:gestationalAge});
                 return res.status(200).json(new ApiResponse(200,response,"List generated according to gestational age"))
            }
            response = await MilkVolume.find({
                $and : [{gestationalAge:gestationalAge,date:volumeDate}]
            })
            return res.status(200).json(new ApiResponse(200,response,"List generated according to gestational age and date "))
    } catch (error) {
        return res.status(200).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}

async function SearchPasteurization(req,res){
    const {poolingCondition,poolingDate} = req.query;
    try {
        let response ;
        if(!poolingDate){
            response = await Pasteurization.find({poolingCondition:poolingCondition});
            return res.status(200).json(new ApiResponse(200,response,"List generated according to pooling condition"))
        }else if(!poolingCondition){
            response = await Pasteurization.find({date:poolingDate});
            return res.status(200).json(new ApiResponse(200,response,"List generated according to pooling date"))
        }
        response = await Pasteurization.find({$and:[{poolingCondition:poolingCondition,date:poolingDate}]})
        return res.status(200).json(new ApiResponse(200,response,"List generated  according to pooling condition and pooling Date"))
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,'Internal Server Error'))
    }
}
async function SearchRequsition(req,res){
    const {date} = req.query;
    try {
        const response = await MilkRequsition.find({feedingDate:date});
        return res.status(200).json(new ApiResponse(200,response,"List generated "))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
    }
}

export {SearchDonor,SearchMilkVolume,SearchPasteurization,SearchRequsition}