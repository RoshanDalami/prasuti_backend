import { MilkVolume } from "../Model/volumeOfMilk.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Gestational } from "../Model/dropdownModels/gestational.model.js";
import { DaanDarta } from "../Model/donorDetails.model.js";
import { Delivery } from "../Model/dropdownModels/delivery.model.js";
import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
async function RegisterMilkVolume(req, res) {
  const body = req.body;
  const { _id } = await Fiscal.findOne({ status: true });

  const quantityArray = body.collectedMilk.map((item, index) => {
    return parseInt(item.quantity);
  });
  const quantityArrayWithRemaining = body?.collectedMilk?.map((item, index) => {
    return {
      ...item,
      remaining: parseInt(item.quantity),
      quantity: parseInt(item.quantity),
    };
  });

  const donor = await DaanDarta.findOne({ _id: body?.donorId });
  console.log(donor)
  let colostrum;
  const currentDate = new Date();
  const dob = new Date(donor.babyStatus.engDateBirth);
  const diffTime = Math.abs(currentDate - dob);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if(diffDays <=3){
    colostrum = true;
  }else{
    colostrum = false;
  }

  const remaining = quantityArray.reduce((acc, value) => acc + value, 0);
  try {
    const isNewDocument = !body._id;
    const newMilkVolume = isNewDocument
      ? new MilkVolume({
          ...body,
          remaining: remaining,
          totalMilkCollected: remaining,
          collectedMilk: quantityArrayWithRemaining,
          fiscalYear: _id,
          isColostrum:colostrum,
        })
      : await MilkVolume.findByIdAndUpdate(
          body._id,
          {
            ...body,
            remaining: remaining,
            totalMilkCollected: remaining,
            collectedMilk: quantityArrayWithRemaining,
          },
          { new: true }
        );
    const savedMilkVolume = await newMilkVolume.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          savedMilkVolume,
          "Volume of milk created successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function testRegisterMilkVolume(req, res) {
  const { _id } = await Fiscal.findOne({ status: true });
  try {
    const body = req.body;
    console.log(body);
    const donorId = body?.donorId;
    const donor = await MilkVolume.findOne({ donorId: donorId });

    if (donor) {
      try {
        const quantityArray = body.collectedMilk.map((item, index) => {
          return parseInt(item.quantity);
        });
        const totalMilkCollected =
          quantityArray?.reduce((amount, acc) => amount + acc, 0) +
          donor?.totalMilkCollected;
        const totalMilkRemaining =
          quantityArray?.reduce((amount, acc) => amount + acc, 0) +
          donor?.remaining;
        donor?.collectedMilk.push(...body?.collectedMilk);
        const response = await MilkVolume.findOneAndUpdate(
          { donorId: donorId },
          {
            $set: {
              remaining: totalMilkRemaining,
              totalMilkCollected: totalMilkCollected,
              collectedMilk: donor?.collectedMilk,
            },
          }
        );
        return res
          .status(200)
          .json(new ApiResponse(200, response, "Volume updated successfully"));
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json(new ApiResponse(500, null, "volume update failed"));
      }
    } else {
      const quantityArray = body.collectedMilk.map((item, index) => {
        return parseInt(item.quantity);
      });
      const quantityArrayWithRemaining = body?.collectedMilk?.map(
        (item, index) => {
          return {
            ...item,
            remaining: parseInt(item.quantity),
            quantity: parseInt(item.quantity),
          };
        }
      );
      const remaining = quantityArray.reduce((acc, value) => acc + value, 0);
      const newMilkVolume = new MilkVolume({
        ...body,
        remaining: remaining,
        totalMilkCollected: remaining,
        collectedMilk: quantityArrayWithRemaining,
        fiscalYear: _id,
      });
      await newMilkVolume.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            newMilkVolume,
            "Milk volume created successfully"
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Sever Error"));
  }
}

async function GetMilkVolume(req, res) {
  try {
    const activeFiscal = await Fiscal.findOne({ status: true });
    const response = await MilkVolume.find({});
    // .populate(
    //   "donorId",
    //   "contactNo hosRegNo"
    // );
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Milk list generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkById(req, res) {
  const id = req.params.id;
  try {
    const response = await MilkVolume.findOne({ _id: id }, { __v: 0 });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated by Id"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
}
async function DeleteMilkById(req, res) {
  const id = req.params.id;
  try {
    const response = await MilkVolume.deleteOne({ _id: id });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Milk volume deleted"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkVolumeByGestationalAge(req, res) {
  const gestationalId = req.query.gestationalId;
  try {
    const response = await Gestational.findOne({
      gestationalId: gestationalId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkVolumeByDonor(req, res) {
  const id = req.params.id;

  let voluemofMilk = [];
  let donorDetails = {};
  try {
    const response = await MilkVolume.find(
      { donorId: id },
      { createdAt: 0, updatedAt: 0 }
    );
    const individual = await DaanDarta.findOne({ _id: id });

    const modeOfDelivery = await Delivery.find({});
    const modeName = modeOfDelivery.filter(
      (item) => item.deliveryId === individual?.modeOfDelivery
    )?.[0]?.deliveryName;
    if (response.length <= 0) {
      donorDetails = {
        donorRegNo: individual?.donorRegNo,
        donorName: individual?.donorName,
        donorAge: individual?.donorAge,
        address: individual?.address,
        contactNo: individual?.contactNo,
        modeOfDelivery: modeName,
        donotedMilkList: [],
      };
    }
    response.forEach((items) => {
      const array = items.collectedMilk.map((item) => {
        return { ...item._doc, date: items.date };
      });
      voluemofMilk.push(...array);
      donorDetails = {
        donorRegNo: individual?.donorRegNo,
        donorName: individual?.donorName,
        donorAge: individual?.donorAge,
        address: individual?.address,
        contactNo: individual?.contactNo,
        modeOfDelivery: modeName,
        donotedMilkList: voluemofMilk,
      };
    });
    return res
      .status(200)
      .json(new ApiResponse(200, donorDetails, "List generated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function GetMilkListByDonor(req, res) {
  const { donorId } = req.params;
  try {
    const response = await MilkVolume.find({
      donorId: donorId,
      remaining: { $gt: 0 },
    });
    console.log(response);
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "List generated according to donorId")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function getDonorWithTotalMilk(req, res) {
  try {
    const response = await MilkVolume.find({});
    const totalMilkCollectedByUserId = {};

    response.forEach((entry) => {
      const userId = entry.donorId; // Assuming donorId represents userId

      // If userId already exists in the object, add milk collected to its total
      if (totalMilkCollectedByUserId[userId]) {
        totalMilkCollectedByUserId[userId] += entry.totalMilkCollected;
      } else {
        // If userId doesn't exist, initialize it with the milk collected
        totalMilkCollectedByUserId[userId] = entry.totalMilkCollected;
      }
    });

    // Create an array of objects with userId and totalMilkCollected
    const resultArray = response.reduce((acc, entry) => {
      const userId = entry.donorId;
      if (!acc[userId]) {
        acc[userId] = {
          _id: entry._id,
          gestationalAge: entry.gestationalAge,
          donorId: userId,
          donorName: entry.donorName,
          totalMilkCollected: entry.totalMilkCollected,
        };
      } else {
        acc[userId].totalMilkCollected += entry.totalMilkCollected;
      }
      return acc;
    }, {});

    const finalResultArray = Object.values(resultArray);

    return res
      .status(200)
      .json(
        new ApiResponse(200, finalResultArray, "Data generated successfully")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export {
  RegisterMilkVolume,
  GetMilkVolume,
  GetMilkVolumeByGestationalAge,
  GetMilkVolumeByDonor,
  GetMilkById,
  DeleteMilkById,
  GetMilkListByDonor,
  getDonorWithTotalMilk,
};
