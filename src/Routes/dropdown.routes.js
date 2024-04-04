import express from "express";
import {
  getBabyStatus,
  getBabyTransfer,
  getBreastFeeding,
  getDelivery,
  getEthnicity,
  getGestational,
  getParity,
} from "../Controller/dropDown.controller.js";
const DropdownRoute = express.Router();



DropdownRoute.route("/getBabyStatus").get(getBabyStatus);
DropdownRoute.route("/getBabyTransfer").get(getBabyTransfer);
DropdownRoute.route("/getBreastFeeding").get(getBreastFeeding);
DropdownRoute.route("/getDelivery").get(getDelivery);
DropdownRoute.route("/getEthnicity").get(getEthnicity);
DropdownRoute.route("/getGestational").get(getGestational);
DropdownRoute.route("/getParity").get(getParity);

export { DropdownRoute };
