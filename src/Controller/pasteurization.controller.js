import { Pasteurization } from "../Model/pasteurization.model.js";
import { MilkVolume } from "../Model/volumeOfMilk.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DaanDarta } from "../Model/donorDetails.model.js";
async function getColostrum(req, res) {
  try {
    let filteredDonarData = [];
    const DonorData = await DaanDarta.find({});
    for (const donar of DonorData) {
      if (donar.babyStatus && donar.babyStatus.engDateBirth) {
        const currentDate = new Date();
        const dob = new Date(donar.babyStatus.engDateBirth);
        const diffTime = Math.abs(currentDate - dob);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        donar.updatedAgeOFChild = diffDays;
        await donar.save();
        if (donar.updatedAgeOFChild <= 3) {
          const donarId = donar._id;

          const volume = await MilkVolume.findOne({ donorId: donarId });
          if (volume !== null) {
            filteredDonarData.push(volume);
          }
        }
      }
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          filteredDonarData,
          "Colostrum generated successfully "
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function getCondition(req, res) {
  try {
    const response = await MilkVolume.find({});

    return res.status(200).json(new ApiResponse(200, response, "Success "));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function getConditionById(req, res) {
  const id = req.params.id;
  try {
    const response = await MilkVolume.find({
      gestationalAge: id,
      remaining: { $gt: 0 },
    });

    const extractedData = response.map((item) => ({
      donorId: item.donorId,
      donorName: item.donorName,
      quantity: item.quantity,
      engDate: item.engDate,
      storedBy: item.storedBy,
      remaining: item.remaining,
      date: item.date,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, extractedData, "Success "));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
  }
}
//create
async function createPasteurization(req, res) {
  try {
    const body = await req.body;
    const donorList = body?.donorDetailsForPooling;
    let batchName = "";
    if (body.poolingCondition == 4) {
      batchName = "CA";
    } else if (body.poolingCondition == 1) {
      batchName = "EPA";
    } else if (body.poolingCondition == 2) {
      batchName = "PA";
    } else {
      batchName = "TA";
    }
    donorList.sort(
      (a, b) => new Date(a.collectedDate) - new Date(b.collectedDate)
    );
    const currentDate = new Date(donorList[0].collectedDate);
    let expireDate = new Date(currentDate);
    expireDate.setMonth(currentDate?.getMonth() + 6);
    expireDate = JSON.stringify(expireDate).split("T")[0].slice(1);

    const newPooling = new Pasteurization({
      ...body,
      batchName: batchName,
      expireDate: expireDate,
    });

    // if(savedData){
    // donorList.forEach(async (item) => {
    //   const donor = await MilkVolume.findOne({ donorId: item.donorId });
    //   if(donor?.remaining < item.volumeOfMilkPooled){
    //     throw new Error
    //   }
    //   const newRemaining = donor?.remaining - item.volumeOfMilkPooled;
    //   await MilkVolume.findOne({ donorId: item.donorId }).then((doc) => {
    //     // if (newRemaining < 0) {
    //     //   return NextResponse.json(
    //     //     { message: "Invalid Milk volume" },
    //     //     { status: 400 }
    //     //   );
    //     // }
    //     doc.remaining = newRemaining;
    //     doc.save();
    //   });
    // });
    // }
    for (const item of donorList) {
      const donor = await MilkVolume.findOne({ donorId: item.donorId });

      if (donor?.remaining < item.volumeOfMilkPooled) {
        throw new Error("Invalid Milk volume");
      }
      const newRemaining = donor?.remaining - item.volumeOfMilkPooled;
      await MilkVolume.findOneAndUpdate(
        { donorId: item.donorId },
        { $set: { remaining: newRemaining } }
      );
    }
    if (body._id) {
      const response = await Pasteurization.findByIdAndUpdate(
        body._id,
        { ...body, batchName: batchName, expireDate: expireDate },
        { new: true }
      );
      return res.status(201).json(new ApiResponse(200, response, "Success"));
    }
    const savedData = await newPooling.save();

    return NextResponse.json(savedData, { status: 200 });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
//get
async function getPasteurization(req, res) {
  try {
    const response = await Pasteurization.find(
      {},
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );
    if (!response) {
      return res
        .status(405)
        .json(new ApiResponse(405, null, "List generation failed"));
    }

    return res
      .status(201)
      .json(new ApiResponse(200, response, "List generated Successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
  }
}
//getbyId
async function getPasteurizationById(req, res) {
  const id = res.params.id;

  try {
    if (!id) {
      return res.status(400).json(new ApiResponse(400, null, "Id not found"));
    }
    const response = await Pasteurization.findOne({ _id: id });

    return res
      .status(201)
      .json(new ApiResponse(200, response, "Record found successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
//delete by ID
async function deletePasteurizationById(req, res) {
  const id = res.params.id;
  try {
    if (!id) {
      return res.status(400).json(new ApiResponse(400, null, "Id not found"));
    }
    const response = await Pasteurization.deleteOne({ _id: id });

    return res
      .status(200)
      .json(new ApiResponse(400, response, "Record deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
export {
  getColostrum,
  getCondition,
  getConditionById,
  createPasteurization,
  getPasteurization,
  getPasteurizationById,
  deletePasteurizationById,
};
