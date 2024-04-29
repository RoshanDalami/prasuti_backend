import { Culter } from "../Model/culture.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Pasteurization } from "../Model/pasteurization.model.js";
async function createCulture(req, res) {
  try {
    const { cultureBottleList, batchId, cultureDate, cultureEngDate } =
      req.body;
    let cultureResult;
    cultureBottleList?.forEach((item) => {
      if (item.cultureResult == "true") {
        cultureResult = true;
      } else {
        cultureResult = false;
      }
    });
    if (cultureResult) {
      await Pasteurization.findOneAndUpdate(
        { _id: batchId },
        { $set: { culture: true } }
      );
    } else {
      await Pasteurization.findOneAndUpdate(
        { _id: batchId },
        { $set: { culture: false } }
      );
    }
    const newCulter = await new Culter({
      batchId,
      cultureDate,
      cultureEngDate,
      cultureResult: cultureResult,
      cultureBottleList,
    });
    const savedData = await newCulter.save();
    return res
      .status(200)
      .json(new ApiResponse(200, savedData, "culture created."));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export { createCulture };