import express from 'express'
import { RegisterDonor , GetDonor,GetInActiveDonor,UpdateDonorStatus,UpdateDonorOtherTest,getDonorOtherTest , discard,UpdateDonorRegDate,getDonorByGestationalAge , copyActiveDonors } from '../Controller/donor.controller.js'
const DonorRouter = express.Router();

DonorRouter.route('/getDonorList').get(GetDonor);
DonorRouter.route('/registerDonor').post(RegisterDonor);
DonorRouter.route("/getInActiveDonor").get(GetInActiveDonor)
DonorRouter.route("/updateStatus/:id").get(UpdateDonorStatus)
DonorRouter.route("/updateOther").patch(UpdateDonorOtherTest)
DonorRouter.route("/getOtherTest/:id").get(getDonorOtherTest)
DonorRouter.route("/discard").post(discard)
DonorRouter.route('/update').get(UpdateDonorRegDate)
DonorRouter.route('/getDonorWithGestationalAge/:id').get(getDonorByGestationalAge)
DonorRouter.route('/copyActiveDonor').get(copyActiveDonors)
export {DonorRouter}