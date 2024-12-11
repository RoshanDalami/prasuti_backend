import { DaanDarta } from "../Model/donorDetails.model.js";

import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Gestational } from "../Model/dropdownModels/gestational.model.js";
import { Parity } from "../Model/dropdownModels/parity.model.js";
import { Delivery } from "../Model/dropdownModels/delivery.model.js";
import { getDays } from "../utils/utils.js";

// Function to get the current fiscal year
async function getCurrentFiscalYear() {
  return await Fiscal.findOne({ status: true });
}

// Function to get the previous fiscal year
async function getPreviousFiscalYear(currentFiscalYear) {
  return await Fiscal.findOne({ startYear: currentFiscalYear.startYear - 1 });
}

export async function RegisterDonor(req, res) {
  const body = req.body;
  const { _id } = await Fiscal.findOne({ status: true });

  try {
    const latestDaanDarta = await DaanDarta.findOne(
      { $and: [{ fiscalYear: _id }] },
      {},
      { sort: { donorRegNo: -1 } }
    );
    console.log(latestDaanDarta);
    let newDonorRegNo = "PMWH-0001";

    // const state = State.findOne({statedId : body?.address?.stateId})
    // const district = District.findOne({districtId:body.address.districtId})
    // const palika = Palika.findOne({palikaId:body.address.palikaId})

    if (latestDaanDarta) {
      const lastDonorRegNo = latestDaanDarta.donorRegNo?.split("-")[1];
      const numericPart = parseInt(lastDonorRegNo, 10);
      newDonorRegNo = "PMWH-" + (numericPart + 1).toString().padStart(4, "0");
    }

    let newDaanDarta = new DaanDarta({
      ...body,
      donorRegNo: newDonorRegNo,
      fiscalYear: _id,
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
      return res
        .status(200)
        .json(
          new ApiResponse(200, null, "Serology Positive she can't donate milk")
        );
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

      return res
        .status(200)
        .json(new ApiResponse(200, null, "she can't donate milk right now !"));
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
      return res
        .status(200)
        .json(new ApiResponse(200, null, "she can't donate milk right now !"));
    }

    // ===============================================================================================	  if (newDaanDarta.serologyRecords.hiv === true) {
    const savedDaanDarta = await newDaanDarta.save();
    return res
      .status(200)
      .json(new ApiResponse(200, savedDaanDarta, "Donor Created Successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

// export async function GetDonor(req, res) {

//   try {
//     const fiscalYear = await Fiscal.findOne({status:true});

//     const response = await DaanDarta.find({ $and:[{isDonorActive: true },{fiscalYear:fiscalYear._id}]}, { __v: 0 });
//     const newArray = await Promise.all(
//       response?.map(async (item) => {
//         try {
//           const gestational = await Gestational.findOne({
//             gestationalId: item.gestationalAge,
//           });
//           const gestationalName = gestational?.gestationalName;
//           const delivery = await Delivery.findOne({
//             deliveryId: item.modeOfDelivery,
//           });
//           const deliveryName = delivery?.deliveryName;
//           const parity = await Parity.findOne({ parityId: item.parity })
//           console.log(parity,'parityByid')
//           const parityName = parity?.parityName;
//           return {
//             ...item.toObject(),
//             gestationalName: gestationalName,
//             deliveryName: deliveryName,
//             parityName: parityName,
//           };
//         } catch (error) {
//           console.error("Error while fetching department:", error);
//           // Return a default object or null if department lookup fails
//           return {
//             ...item.toObject(),
//             gestationalName: null,
//             deliveryName: null,
//             parityName: null,
//           };
//         }
//       })
//     );
//     return res
//       .status(200)
//       .json(
//         new ApiResponse(200, newArray, "Donor List Generated Successfully")
//       );
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(200)
//       .json(new ApiResponse(500, null, "Internal Server Error"));
//   }
// }
export async function GetDonor(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 8; // default to 10 items per page

    const fiscalYear = await Fiscal.findOne({ status: true });

    if (!fiscalYear) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No active fiscal year found"));
    }
    const totalCount = await DaanDarta.countDocuments({ isDonorActive: true });

    const donors = await DaanDarta.find(
      { isDonorActive: true },
      { __v: 0 }
    ).sort({ createdAt: -1 });
    // .skip((page - 1) * limit)
    // .limit(limit);
    const totalDonor = await DaanDarta.find({});
    if (totalDonor) {
      for (const donor of totalDonor) {
        const updatedAge = getDays(donor?.engDate, donor?.ageOfChild);
        console.log(updatedAge);
        donor.updatedAgeOFChild = parseInt(updatedAge);
        donor.save();
      }
    }

    const enrichedDonors = await Promise.all(
      donors.map(async (donor) => {
        try {
          const [gestational, delivery, parity] = await Promise.all([
            Gestational.findOne({ gestationalId: donor.gestationalAge }),
            Delivery.findOne({ deliveryId: donor.modeOfDelivery }),
            Parity.findOne({ parityId: donor.parity }),
          ]);

          return {
            ...donor.toObject(),
            gestationalName: gestational?.gestationalName || null,
            deliveryName: delivery?.deliveryName || null,
            parityName: parity?.parityName || null,
          };
        } catch (error) {
          console.error("Error while fetching additional data:", error);
          return {
            ...donor.toObject(),
            gestationalName: null,
            deliveryName: null,
            parityName: null,
          };
        }
      })
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: enrichedDonors, totalCount },
          "Donor List Generated Successfully"
        )
      );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function copyActiveDonors(req, res) {
  try {
    const currentFiscalYear = await getCurrentFiscalYear();

    if (!currentFiscalYear) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No active fiscal year found"));
    }

    const previousFiscalYear = await getPreviousFiscalYear(currentFiscalYear);

    if (!previousFiscalYear) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No previous fiscal year found"));
    }

    // Find active donors from the previous fiscal year
    const activeDonors = await DaanDarta.find({
      isDonorActive: true,
      fiscalYear: previousFiscalYear._id,
    });

    // Prepare new donors for the current fiscal year
    const newDonors = activeDonors.map((donor) => ({
      ...donor.toObject(),
      // _id: new mongoose.Types.ObjectId(), // Create a new ObjectId
      fiscalYear: currentFiscalYear._id,
    }));

    // Insert the new donors into the collection
    if (newDonors.length > 0) {
      await DaanDarta.insertMany(newDonors);
    }

    // Enrich donor data
    const enrichedDonors = await Promise.all(newDonors.map(enrichDonorData));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          enrichedDonors,
          "Donors copied and enriched successfully"
        )
      );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function GetInActiveDonor(req, res) {
  try {
    const response = await DaanDarta.find({ isDonorActive: false }, { __v: 0 });
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Donor List Generated Successfully")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function DataForExcel(req, res) {
  try {
    const response = await DaanDarta.find(
      {},
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );
    const newArray = response?.map((item) => {
      return {
        ...item,
      };
    });
    return res.status(200).json(new ApiResponse(200, response, "List"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function UpdateDonorStatus(req, res) {
  try {
    const { id } = req.params;
    const previousData = await DaanDarta.findOne({ _id: id });
    const previousStatus = previousData?.isDonorActive;
    const response = await DaanDarta.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isDonorActive: !previousStatus,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Donor updated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function UpdateDonorOtherTest(req, res) {
  try {
    const { id, other } = req.body;

    // Validate ID

    // Find and update the document
    const response = await DaanDarta.findOneAndUpdate(
      { _id: id },
      { $push: { other: { $each: other } } },
      { new: true, runValidators: true, upsert: true }
    );

    // Check if document was found and updated
    if (!response) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Document not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Update successful"));
  } catch (error) {
    console.error("Error updating document:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function getDonorOtherTest(req, res) {
  try {
    const { id } = req.params;
    const response = await DaanDarta.findOne({ _id: id });
    const otherTests = response?.other;
    return res
      .status(200)
      .json(
        new ApiResponse(200, otherTests, "Other test Generated successfully")
      );
  } catch (error) {
    return res.status(500).json(500, null, "Internal Server Error");
  }
}

export async function discard(req, res) {
  try {
    const { id, discardDate } = req.body;
    const response = await DaanDarta.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          discard: true,
          isDonorActive: false,
          discardDate: discardDate,
        },
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Discarded successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export async function UpdateDonorRegDate(req, res) {
  try {
    await DaanDarta.updateMany(
      {},
      {
        $set: {
          donorRegisteredDate: "2080-02-13",
        },
      }
    );
    return res.status(200).json(new ApiResponse(200, "success", "updaetd"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server error"));
  }
}

export async function getDonorByGestationalAge(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(new ApiResponse(400, null, "id not found"));
    }
    const response = await DaanDarta.find({ gestationalAge: id });
    if (!response) {
      return res.status(400).json(new ApiResponse(400, null, "Data not found"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response,
          "Donor generated according to Gestational Age."
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
export async function getDonorReg(req, res) {
  try {
    const list = await DaanDarta.find({});
    const hosRegNoList = list?.map((item) => item.hosRegNo);
    return res.status(200).json(new ApiResponse(200, hosRegNoList, "list"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "internal server error"));
  }
}
