import { Bottle } from "../Model/bottle.model.js";
import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Pasteurization } from '../Model/pasteurization.model.js'
async function GenerateBottle(req, res) {
  try {
    const {
      poolingId,
      poolingCondition,
      expireDate,
      totalVolume,
      poolingDate,
    } = req.body;
    const { _id } = await Fiscal.findOne({ status: true });
    const totalMilk = totalVolume;
    const bottleSize = 140;
    const yes = await Pasteurization.findOne({_id:poolingId});

    let remainingMilk = totalMilk;
    let bottleNumber = "001";

    const bottles = [];
    let bottleTag = `${yes.batchName}:${yes.batchName}` ;
    // if (poolingCondition == 4) {
    //   bottleTag = "CA:CA";
    // } else if (poolingCondition == 1) {
    //   bottleTag = "EPA:EPA";
    // } else if (poolingCondition == 2) {
    //   bottleTag = "PA:PA";
    // } else {
    //   bottleTag = "TA:TA";
    // }

    while (remainingMilk >= bottleSize) {
      const bottleName =
        typeof bottleNumber == "string"
          ? `${bottleTag}${bottleNumber}`
          : `${bottleTag}${"00"}${bottleNumber}`;
      const bottle = {
        poolingId: poolingId,
        poolingCondition: poolingCondition,
        name: bottleName,
        volume: bottleSize,
        remainingVoluem: bottleSize,
        expireDate: expireDate,
        poolingDate: poolingDate,
      };
      bottles.push(bottle);

      remainingMilk -= bottleSize;
      bottleNumber = parseInt(bottleNumber, 10) + 1;
    }

    // If there is any remaining milk less than the bottle size, add it to the last bottle
    if (remainingMilk > 0) {
      //   const lastBottleName = `${bottleTag}${bottleNumber}`;
      const lastBottleName =
        typeof bottleNumber == "string"
          ? `${bottleTag}${bottleNumber}`
          : `${bottleTag}${"00"}${bottleNumber}`;
      const lastBottle = {
        poolingId: poolingId,
        poolingCondition: poolingCondition,
        name: lastBottleName,
        volume: remainingMilk,
        remainingVoluem: remainingMilk,
        expireDate: expireDate,
        poolingDate: poolingDate,
      };
      bottles.push(lastBottle);
    }

    // Output the array of bottles
    const newBottle = new Bottle({
      poolingId,
      poolingCondition,
      expireDate,
      totalVolume,
      poolingDate: poolingDate,
      bottleList: bottles,
      fiscalYear: _id,
    });
    const savedBottle = await newBottle.save();
    return res
      .status(200)
      .json(new ApiResponse(200, savedBottle, "Bottle generated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function GetBottle(req, res) {
  try {
    const id = req.params.id;
    const response = await Bottle.findOne({ poolingId: id});
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Bottle list generated successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
}

export { GenerateBottle, GetBottle };
