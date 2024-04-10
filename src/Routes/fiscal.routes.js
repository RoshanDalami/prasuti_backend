import express from "express";
import { getFiscal, createFiscal } from "../Controller/fiscal.controller.js";
const fiscalRouter = express.Router();
fiscalRouter.route("/getFiscal").get(getFiscal);
fiscalRouter.route("/createFiscal").post(createFiscal);
export { fiscalRouter };
