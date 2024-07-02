import express from "express";
import {
  GetTotalBaby,
  GetTotalDonor,
  GetTotalMilkCollected,
  GetTotalRequsition,
  GetMilkCollectedMonthly,
  GetMilkRequsitionMonthly,
  GetRegisteredDonorMonthly,
  GetTotalPasturizedMilk,
  GetTotalDispensedMilk,
  GetDashboardNumber
} from "../Controller/dashboard.controller.js";

const DashboardRouter = express.Router();

DashboardRouter.route("/getNumberOfBaby").get(GetTotalBaby);
DashboardRouter.route("/getNumberOfDonor").get(GetTotalDonor);
DashboardRouter.route("/getNumberOfMilkCollected").get(GetTotalMilkCollected);
DashboardRouter.route("/getTotalMilkRequsition").get(GetTotalRequsition);
DashboardRouter.route("/getMilkCollectedMonthWise").get(
  GetMilkCollectedMonthly
);
DashboardRouter.route("/getMilkRequsitionMonthWise").get(
  GetMilkRequsitionMonthly
);
DashboardRouter.route("/getDonorCountMonthly").get(GetRegisteredDonorMonthly);
DashboardRouter.route("/getTotalPasturizedMilk").get(GetTotalPasturizedMilk);
DashboardRouter.route("/getTotalDispenseMilk").get(GetTotalDispensedMilk);
DashboardRouter.route("/getAllRecords").get(GetDashboardNumber);
export { DashboardRouter };
