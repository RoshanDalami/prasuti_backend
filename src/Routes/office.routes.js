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

OfficeRouter.route('/registerOffice').post(validateToken,RegisterOffice);
OfficeRouter.route('/getOffice').get(validateToken,GetOffice);
OfficeRouter.route('/getState').get(validateToken,GetState);
OfficeRouter.route('/getPalika').get(validateToken,GetPalika);
OfficeRouter.route('/getdistrict').get(validateToken,GetDistrict);
OfficeRouter.route('/registerDepartment').post(validateToken,RegisterDepartment);
OfficeRouter.route('/getDepartment').get(validateToken,GetDepartment);
OfficeRouter.route('/registerPost').post(validateToken,RegisterPost);
OfficeRouter.route('/getPost').get(validateToken,GetPost);
OfficeRouter.route('/registerEmployee').post(validateToken,RegisterEmployee);
OfficeRouter.route('/getEmployee').get(validateToken,GetEmployee)



export { OfficeRouter };
