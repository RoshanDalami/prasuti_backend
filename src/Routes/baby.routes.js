import express from "express";
import {
  getBabyDetail,
  createBabyDetail,
  getBabyDetailId,
  updateBabyStatus,
  statusUpdate,
  GetInactiveBaby,
  SearchBaby

} from "../Controller/baby.controller.js";
const babyRoute = express.Router();
babyRoute.route("/getBabyDetail").get(getBabyDetail);

babyRoute.route("/getBabyDetailId/:id").get(getBabyDetailId);


babyRoute.route("/createBabyDetail").post(createBabyDetail);
babyRoute.route("/updateBaby/:id").get(updateBabyStatus);
babyRoute.route("/statusUpdate/:id").get(statusUpdate);
babyRoute.route("/getInactiveBaby").get(GetInactiveBaby);
babyRoute.route("/searchBaby/:term").get(SearchBaby)

export { babyRoute };
