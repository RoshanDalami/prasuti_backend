import express from "express";
import {
  CreateDonation,
  GetDonation,
  GetDonationById,
  DeleteDonation,
} from "../Controller/donation.controller.js";
const donationRoute = express.Router();

donationRoute.route("/createDonation").post(CreateDonation);
donationRoute.route("/getAllDonation").get(GetDonation);
donationRoute.route("/getDonationById/:id").get(GetDonationById);
donationRoute.route("/deleteDonation/:id").delete(DeleteDonation);

export default donationRoute