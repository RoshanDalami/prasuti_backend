import express from "express";
import {
  GetMilkVolume,
  RegisterMilkVolume,
} from "../Controller/milkVolume.controller.js";
const milkVolumeRoute = express.Router();
milkVolumeRoute.route("/getMilkVolume").get(GetMilkVolume);
milkVolumeRoute.route("/postMilkVolume").post(RegisterMilkVolume);

export { milkVolumeRoute };
