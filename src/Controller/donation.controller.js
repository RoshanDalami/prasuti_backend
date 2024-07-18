import { Donation } from "../Model/officeSetupModels/Donation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export async function CreateDonation(req, res) {
  try {
    const { id, name } = req.body;

    if (!name) throw new Error("All fields are required");
    if (id) {
      const response = await Donation.findOneAndUpdate(
        { _id: id },
        {
         $set:{ name: name,}
        }
      );
      return res.status(200).json(new ApiResponse(200,response,"Updated successfully"))
    }
    const savedDonation = await Donation.create({
      name: name,
    });
    if (!savedDonation) throw new Error("Error while creating donation");
    return res
      .status(200)
      .json(
        new ApiResponse(200, savedDonation, "Donation Created successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
}

export async function GetDonation(req, res) {
  try {
    const response = await Donation.find({});
    if (!response) throw new Error("Error while fetching data");
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Donation place generated successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
}

export async function GetDonationById(req, res) {
  try {
    const { id } = req.params;
    const response = await Donation.findOne({ _id: id });
    if (!response) throw new Error("Error while fetching Data");
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, `Data of ${id} generated successfully `)
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
}

export async function DeleteDonation(req, res) {
  try {
    const { id } = req.params;
    const resposne = await Donation.findOneAndDelete({ _id: id });
    if (!resposne) throw new Error("Error while Delete Donation");
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Donation Deleted Successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
}
