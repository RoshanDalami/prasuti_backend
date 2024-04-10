import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function createFiscal(req, res) {
  try {
    const { fiscalYear, startYear, endYear, startDate, endDate, status } =
      req.body;
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
