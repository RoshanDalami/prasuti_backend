import express from "express";
import {
  getPasteurization,
  getPasteurizationById,
  createPasteurization,
  deletePasteurizationById,
  getColostrum,
  getCondition,
  getConditionById,
  getDonorByGestationalAge,
  updateCulture,
  updateOtherStatus
} from "../Controller/pasteurization.controller.js";
const pasteurizationRouter = express.Router();
pasteurizationRouter.route("/getPasteurization").get(getPasteurization);
pasteurizationRouter.route("/getPasteurizationById/:id").get(getPasteurizationById);

pasteurizationRouter.route("/createPasteurization").post(createPasteurization);
pasteurizationRouter
  .route("/deletePasteurizationById/:id")
  .delete(deletePasteurizationById);
pasteurizationRouter.route("/getColostrum").get(getColostrum);
pasteurizationRouter.route("/getCondition").get(getCondition);
pasteurizationRouter.route("/getConditionById/:id").get(getConditionById);
pasteurizationRouter.route("/getDonorByGestationalAge/:gestationalAge").get(getDonorByGestationalAge)
pasteurizationRouter.route("/updateCulture").post(updateCulture)
pasteurizationRouter.route('/updateOther').post(updateOtherStatus)

export { pasteurizationRouter };
