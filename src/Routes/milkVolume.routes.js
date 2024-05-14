import express from "express";
import {

  RegisterMilkVolume,
  GetMilkVolume,
  GetMilkVolumeByGestationalAge,
  GetMilkVolumeByDonor,
  GetMilkById,
  DeleteMilkById,
  GetMilkListByDonor,
  getDonorWithTotalMilk
} from "../Controller/milkVolume.controller.js";
const MilkVolumeRoute = express.Router();
MilkVolumeRoute.route('/registerMilkVolume').post(RegisterMilkVolume);
MilkVolumeRoute.route('/getMilkVolume').get(GetMilkVolume);
MilkVolumeRoute.route('/getMilkVolumeByGestationalAge').get(GetMilkVolumeByGestationalAge);
MilkVolumeRoute.route('/getMilkVolumeByDonor/:id').get(GetMilkVolumeByDonor)
MilkVolumeRoute.route('/getMilkById/:id').get(GetMilkById)
MilkVolumeRoute.route('/deleteMilkById/:id').delete(DeleteMilkById)
MilkVolumeRoute.route('/volumeByDonorId/:donorId').get(GetMilkListByDonor)
MilkVolumeRoute.route('/donorWithTotalVolume').get(getDonorWithTotalMilk)
export { MilkVolumeRoute };

