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
async function updateBottleStatus(req,res){
  try{
    const {id} = req.params;
    const bottle = await Bottle.findOne(
        { "bottleList._id": id },
        { bottleList: { $elemMatch: { _id: id } } } // Project only the matching item in bottleList
    );

// Check if the bottle was found and has the item
    if (bottle && bottle.bottleList.length > 0) {
      const currentItem = bottle.bottleList[0]; // Get the matching item
      const newStatus = !currentItem.isActive; // Toggle the current status

      // Step 2: Update the item's isActive field
      const response = await Bottle.findOneAndUpdate(
          { "bottleList._id": id },
          { $set: { "bottleList.$.isActive": newStatus } }, // Toggle the isActive field
          { new: true } // Return the updated document
      );

      console.log(response);
    return res.status(200).json( new ApiResponse(200, response, "Bottle updated successfully") );
    } else {
      console.log("Item not found");
    }


  }catch(err){
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function updateManyBottles(req,res){
  try{
    const response = await Bottle.updateMany(
        { /* filter criteria for the main document */ },
        [
          {
            $set: {
              bottleList: {
                $map: {
                  input: "$bottleList",
                  as: "item",
                  in: {
                    $cond: [
                      { /* condition to match items for update */ },
                      { $mergeObjects: ["$$item", { isActive: true }] }, // Update fields if condition is met
                      "$$item" // Otherwise, keep the item unchanged
                    ]
                  }
                }
              }
            }
          }
        ]
    );
    return res.status(200).json( new ApiResponse(200, response, "Bottle updated successfully"));
  }catch(err){}
}

export { GenerateBottle, GetBottle,updateBottleStatus,updateManyBottles };
