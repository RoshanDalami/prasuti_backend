import { DaanDarta } from "../Model/donorDetails.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { MilkVolume } from "../Model/volumeOfMilk.model.js";
import { Pasteurization } from "../Model/pasteurization.model.js";
import { MilkRequsition } from "../Model/requistion.model.js";
async function SearchDonor(req, res) {
  try {
    let response;
    const { donorName, number, regNumber } = req.query;
    if (!donorName && !regNumber) {
      response = await DaanDarta.find({ contactNo: number });
      return res
        .status(200)
        .json(
          new ApiResponse(200, response, "List generated with Donor Number")
        );
    } else if (!number && !regNumber) {
      response = await DaanDarta.find({ donorName: donorName });
      return res
        .status(200)
        .json(new ApiResponse(200, response, "List generated with Donor Name"));
    } else if (!number && !donorName) {
      response = await DaanDarta.find({ hosRegNo: regNumber });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "List Generated with Donor Hospital Registration Number"
          )
        );
    } else if (!donorName) {
      response = await DaanDarta.find({
        $and: [{ contactNo: number }, { hosRegNo: regNumber }],
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "list generated according to contact number and hospital regestration number"
          )
        );
    } else if (!number) {
      response = await DaanDarta.find({
        $and: [{ donorName: donorName }, { hosRegNo: regNumber }],
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "list generated according to donor name and hospital regestration number"
          )
        );
    } else if (!regNumber) {
      response = await DaanDarta.find({
        $and: [{ contactNo: number }, { donorName: donorName }],
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "list generated according to contact number  and donor Name"
          )
        );
    } else {
      response = await DaanDarta.find({
        $and: [{ donorName: donorName, contactNo: number }],
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "List generated with Donor Name and Number"
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function SearchMilkVolume(req, res) {
  const { donorName } = req.query;
  try {
    const response = await MilkVolume.find({ donorName: donorName });
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Milk Volume generated by donor name")
      );
  } catch (error) {
    return res
      .status(200)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function SearchPasteurization(req, res) {
  const { poolingCondition, poolingDate } = req.query;
  try {
    let response;
    if (!poolingDate) {
      response = await Pasteurization.find({
        poolingCondition: poolingCondition,
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "List generated according to pooling condition"
          )
        );
    } else if (!poolingCondition) {
      response = await Pasteurization.find({ date: poolingDate });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            response,
            "List generated according to pooling date"
          )
        );
    }
    response = await Pasteurization.find({
      $and: [{ poolingCondition: poolingCondition, date: poolingDate }],
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response,
          "List generated  according to pooling condition and pooling Date"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function SearchRequsition(req, res) {
  const { date } = req.query;
  try {
    const response = await MilkRequsition.find({ feedingDate: date });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated "));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export {
  SearchDonor,
  SearchMilkVolume,
  SearchPasteurization,
  SearchRequsition,
};
