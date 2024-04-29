import { Pasteurization } from "../Model/pasteurization.model.js";
import { MilkVolume } from "../Model/volumeOfMilk.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DaanDarta } from "../Model/donorDetails.model.js";
import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
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
    const { _id } = await Fiscal.findOne({ status: true });

    const donorList = body?.donorDetailsForPooling;
    let batchName = "";
    const existingList = await Pasteurization.find({
      poolingCondition: body.poolingCondition,
    });

    const lastElement = existingList[existingList.length - 1];

    if (body.poolingCondition == 4) {
      if (existingList.length > 0) {
        const lastChar = lastElement.batchName.charAt(
          lastElement.batchName.length - 1
        );
        const code = lastChar.charCodeAt(0);
        const sufix = String.fromCharCode(code + 1);

        batchName = `C${sufix}`;
      } else {
        batchName = "CA";
      }
    } else if (body.poolingCondition == 1) {
      if (existingList.length > 0) {
        const lastChar = lastElement.batchName.charAt(
          lastElement.batchName.length - 1
        );
        const code = lastChar.charCodeAt(0);
        const sufix = String.fromCharCode(code + 1);

        batchName = `EP${sufix}`;
      } else {
        batchName = "EPA";
      }
    } else if (body.poolingCondition == 2) {
      if (existingList.length > 0) {
        const lastChar = lastElement.batchName.charAt(
          lastElement.batchName.length - 1
        );
        const code = lastChar.charCodeAt(0);
        const sufix = String.fromCharCode(code + 1);

        batchName = `P${sufix}`;
      } else {
        batchName = "PA";
      }
    } else {
      if (existingList.length > 0) {
        const lastChar = lastElement.batchName.charAt(
          lastElement.batchName.length - 1
        );
        const code = lastChar.charCodeAt(0);
        const sufix = String.fromCharCode(code + 1);
        batchName = `T${sufix}`;
      } else {
        batchName = "TA";
      }
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
      fiscalYear: _id,
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
    for (const item of donorList){
      const donor = await MilkVolume.findOne({_id:item?.milkvolumeId });
     
        if (donor?.remaining < item.volumeOfMilkPooled) {
          throw new Error("Invalid Milk volume");
        }
    }
    for (const item of donorList) {
      const donor = await MilkVolume.findOne({_id:item?.milkvolumeId });
      console.log(donor, "response");

        if (donor?.remaining < item.volumeOfMilkPooled) {
          throw new Error("Invalid Milk volume");
        }
        const newRemaining =
          donor?.remaining - item.volumeOfMilkPooled;
        await MilkVolume.findOneAndUpdate(
          { _id:item?.milkvolumeId },
          { $set: { remaining: newRemaining } }
        );
      

      // try {

      //   await MilkVolume.findOne({donorId:item.donorId}).then((doc)=>{
      //     const milk = doc.collectedMilk.id(item.milkvolumeId)
      //     milk.remaining = milk.remaining - item.volumeOfMilkPooled;
      //     doc.save()
      //   })
      // } catch (error) {
      //   console.log(error)
      // }
      // try {
      //   // Find documents that match the criteria
      //   const docs = await MilkVolume.find({ donorId: item.donorId });

      //   // Update each document
      //   for (const doc of docs) {
      //     const milk = doc.collectedMilk.id(item.milkvolumeId);
      //     if (milk) {
      //       milk.remaining -= item.volumeOfMilkPooled;
      //       await doc.save();
      //     } else {
      //       console.error('Milk subdocument not found in document with ID:', doc._id);
      //     }
      //   }
      // } catch (error) {
      //   console.error('An error occurred:', error);
      // }
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

    return res.status(201).json(new ApiResponse(200, savedData, "Success"));
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
  const id = req.params.id;

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
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json(new ApiResponse(400, null, "Id not found"));
    }
    const response = await Pasteurization.deleteOne({ _id: id });

    return res
      .status(200)
      .json(new ApiResponse(200, response, "Record deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function getDonorByGestationalAge(req, res) {
  try {
    const { gestationalAge } = req.params;
    const response = await DaanDarta.find({ gestationalAge: gestationalAge });
    const filterArray = [];
    for (const donor of response) {
      const donorId = donor._id;
      const response = await MilkVolume.findOne({ donorId: donorId });
      if (response != null) {
        filterArray.push(response);
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, filterArray, "List Generated Successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function updateCulture(req,res){
  try {
    
    
    const {id,culture} = req.body;
    if(!id){
      return res.status(404).json(new ApiResponse(404,null,'Id not found'))
    }
    
    const response = await Pasteurization.findOneAndUpdate({_id:id},{
      $set:{culture:culture}
    },{new:true});
    return res.status(200).json(new ApiResponse(200,response,"Updated Successfully"))
  } catch (error) {
    console.log(error)
    return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
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
  getDonorByGestationalAge,
  updateCulture
};
