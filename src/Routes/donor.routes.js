import express from 'express'
import { RegisterDonor , GetDonor } from '../Controller/donor.controller.js'
const DonorRouter = express.Router();

DonorRouter.route('/getDonorList').get(GetDonor);
DonorRouter.route('/registerDonor').post(RegisterDonor);

export {DonorRouter}