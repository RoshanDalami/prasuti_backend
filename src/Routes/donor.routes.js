import express from 'express'
import { RegisterDonor , GetDonor,GetInActiveDonor } from '../Controller/donor.controller.js'
const DonorRouter = express.Router();

DonorRouter.route('/getDonorList').get(GetDonor);
DonorRouter.route('/registerDonor').post(RegisterDonor);
DonorRouter.route("/getInActiveDonor").get(GetInActiveDonor)

export {DonorRouter}