import express from "express";
import {
  getBabyDetail,
  createBabyDetail,
  getBabyDetailId,
} from "../Controller/baby.controller.js";
const babyRoute = express.Router();
babyRoute.route("/getBabyDetail").get(getBabyDetail);

babyRoute.route("/getBabyDetailId/:id").get(getBabyDetailId);


babyRoute.route("/createBabyDetail").post(createBabyDetail);

export { babyRoute };
