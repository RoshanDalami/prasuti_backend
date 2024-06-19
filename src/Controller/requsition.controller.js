import { MilkRequsition } from "../Model/requistion.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BabyDetail } from "../Model/baby.model.js";
import { Bottle } from "../Model/bottle.model.js";
import { Fiscal } from "../Model/officeSetupModels/fiscal.model.js";
// async function RegisterMilkRequsition(req, res) {
//   const body = req.body;
//   // console.log(body,'response')

//   try {
//     const { _id } = body;
//     const fiscalYearId = await Fiscal.findOne({ status: true })._id;

//     if (_id) {
//       const response = await MilkRequsition.findByIdAndUpdate(
//         _id,
//         { ...body },
//         { new: true }
//       );
//       return res
//         .status(200)
//         .json(new ApiResponse(200, response, "Milk requsition updated"));
//     }
//     console.log(body?.requisitedMilk)
//        // Update bottle quantities sequentiallys
//        for (const items of body?.requisitedMilk || []) {
//         const poolingId = items.batchNumber.split("/")?.[0];
//         const doc = await Bottle.findOne({ poolingId: poolingId }).exec();
//         if (doc) {
//           const item = doc.bottleList.id(items.bottleName.split("/")?.[0]);
//           if (item) {
//             item.remainingVoluem = item.remainingVoluem - items.quantity;
//             await doc.save();
//           } else {
//             console.error(`Bottle with name ${items.bottleName.split("/")?.[0]} not found in document with poolingId ${poolingId}`);
//           }
//         } else {
//           console.error(`Document with poolingId ${poolingId} not found`);
//         }
//       }
  
//     const babyDetail = await BabyDetail.findOne({ _id: body?.babyId });
//     const consumnedMilk =
//       body?.requisitedMilk
//         ?.map((item) => {
//           return parseInt(item?.quantity);
//         })
//         .reduce((acc, amount) => acc + amount, 0) + babyDetail?.milkConsumed;
//     const totalRequisitedMilk = body?.requisitedMilk
//       ?.map((item) => {
//         return parseInt(item?.quantity);
//       })
//       .reduce((acc, amount) => acc + amount, 0);
//     const newMilkRequsition = new MilkRequsition({
//       ...body,
//       fiscalYear: fiscalYearId,
//       totalRequisitedMilk: totalRequisitedMilk,
//     });
//     const response = await newMilkRequsition.save();
//     await BabyDetail.findOneAndUpdate(
//       { _id: body?.babyId },
//       {
//         $set: { milkConsumed: consumnedMilk },
//       }
//     );

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(200, body, "Milk requestion registered successfully")
//       );
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, null, "Internal Server Error"));
//   }
// }

async function RegisterMilkRequsition(req, res) {
  const body = req.body;

  try {
    const { _id } = body;
    const fiscalYear = await Fiscal.findOne({ status: true });

    if (!fiscalYear) {
      return res.status(400).json(new ApiResponse(400, null, "Fiscal year not found"));
    }

    const fiscalYearId = fiscalYear._id;

    if (_id) {
      const response = await MilkRequsition.findByIdAndUpdate(
        _id,
        { ...body },
        { new: true }
      );
      return res.status(200).json(new ApiResponse(200, response, "Milk requisition updated"));
    }

    if (!body?.requisitedMilk || !Array.isArray(body.requisitedMilk)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid requisited milk data"));
    }

    // Map to track the total volume requisitioned from each bottle
    const bottleVolumes = {};

    for (const items of body.requisitedMilk) {
      const poolingId = items.batchNumber.split("/")?.[0];
      const bottleDoc = await Bottle.findOne({ poolingId: poolingId }).exec();
      
      if (bottleDoc) {
        const bottleItem = bottleDoc.bottleList.id(items.bottleName.split("/")?.[0]);
        
        if (bottleItem) {
          const bottleId = items.bottleName.split("/")?.[0];
          if (!bottleVolumes[bottleId]) {
            bottleVolumes[bottleId] = {
              remainingVoluem: bottleItem.remainingVoluem,
              requisitioned: 0
            };
          }

          // Check if the total requisitioned volume exceeds the available volume
          if (bottleVolumes[bottleId].requisitioned + items.quantity > bottleVolumes[bottleId].remainingVoluem) {
            return res.status(400).json(new ApiResponse(400, null, `Requisition volume exceeds available volume for bottle ${items.bottleName.split("/")?.[0]}`));
          }

          // Update the requisitioned volume
          bottleVolumes[bottleId].requisitioned += items.quantity;
        } else {
          console.error(`Bottle with name ${items.bottleName.split("/")?.[0]} not found in document with poolingId ${poolingId}`);
          return res.status(400).json(new ApiResponse(400, null, `Bottle with name ${items.bottleName.split("/")?.[0]} not found in document with poolingId ${poolingId}`));
        }
      } else {
        console.error(`Document with poolingId ${poolingId} not found`);
        return res.status(400).json(new ApiResponse(400, null, `Document with poolingId ${poolingId} not found`));
      }
    }

    // If validation passes, update the bottle volumes
    for (const items of body.requisitedMilk) {
      const poolingId = items.batchNumber.split("/")?.[0];
      const bottleDoc = await Bottle.findOne({ poolingId: poolingId }).exec();

      if (bottleDoc) {
        const bottleItem = bottleDoc.bottleList.id(items.bottleName.split("/")?.[0]);
        if (bottleItem) {
          bottleItem.remainingVoluem -= items.quantity;
          await bottleDoc.save();
        }
      }
    }

    const babyDetail = await BabyDetail.findOne({ _id: body.babyId });
    if (!babyDetail) {
      return res.status(400).json(new ApiResponse(400, null, "Baby detail not found"));
    }

    const totalRequisitedMilk = body.requisitedMilk
      .map(item => parseInt(item.quantity))
      .reduce((acc, amount) => acc + amount, 0);

    const consumedMilk = totalRequisitedMilk + (babyDetail.milkConsumed || 0);

    const newMilkRequisition = new MilkRequsition({
      ...body,
      fiscalYear: fiscalYearId,
      totalRequisitedMilk: totalRequisitedMilk,
    });

    const response = await newMilkRequisition.save();

    await BabyDetail.findOneAndUpdate(
      { _id: body.babyId },
      { $set: { milkConsumed: consumedMilk } }
    );

    return res.status(200).json(new ApiResponse(200, response, "Milk requisition registered successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function GetMilkRequsition(req, res) {
  try {
    const response = await MilkRequsition.find(
      {},
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

async function GetMilkRequsitionById(req, res) {
  const id = req.params.id;
  try {
    if (!id) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Id is undefined"));
    }
    const response = await MilkRequsition.findOne({ _id: id });
    return res
      .status(200)
      .json(new ApiResponse(200, response, "List generated by id"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}
async function DeleteMilkRequsition(req, res) {
  const id = req.params.id;
  try {
    if (!id) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Id is undefined"));
    }
    const response = await MilkRequsition.deleteOne({ _id: id });
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Milk requsition deleted successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
}

export {
  RegisterMilkRequsition,
  GetMilkRequsition,
  GetMilkRequsitionById,
  DeleteMilkRequsition,
};
