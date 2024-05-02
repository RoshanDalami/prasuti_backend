import express from "express";
import { getFiscal, createFiscal , updateFiscalYearStatus , getFiscalYearById } from "../Controller/fiscal.controller.js";
const fiscalRouter = express.Router();
fiscalRouter.route("/getFiscal").get(getFiscal);
fiscalRouter.route("/getFiscal/:id").get(getFiscalYearById);
fiscalRouter.route("/createFiscal").post(createFiscal);
fiscalRouter.route("/updateStatus/:id").get(updateFiscalYearStatus);
export { fiscalRouter };
