import express from "express";
import {
  RegisterOffice,
  GetOffice,
  GetState,
  GetPalika,
  GetDistrict,
  RegisterDepartment,
  GetDepartment,
  RegisterPost,
  GetPost,
  RegisterEmployee,
  GetEmployee,
} from "../Controller/office.controller.js";
import { validateToken } from "../middleware/verify.middleware.js";
const OfficeRouter = express.Router();

OfficeRouter.route('/registerOffice').post(RegisterOffice);
OfficeRouter.route('/getOffice').get(GetOffice);
OfficeRouter.route('/getState').get(GetState);
OfficeRouter.route('/getPalika').get(GetPalika);
OfficeRouter.route('/getdistrict').get(GetDistrict);
OfficeRouter.route('/registerDepartment').post(RegisterDepartment);
OfficeRouter.route('/getDepartment').get(GetDepartment);
OfficeRouter.route('/registerPost').post(RegisterPost);
OfficeRouter.route('/getPost').get(GetPost);
OfficeRouter.route('/registerEmployee').post(RegisterEmployee);
OfficeRouter.route('/getEmployee').get(GetEmployee)



export { OfficeRouter };
