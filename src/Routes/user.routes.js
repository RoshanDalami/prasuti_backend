import express from "express";
import { RegisterUser, LoginUser,ModuleAccess , GetAllUser,getOneUser,SetAllModule,GetAllModule} from "../Controller/user.controller.js";
const UserRouter = express.Router();

UserRouter.route('/registerUser').post(RegisterUser);
UserRouter.route('/login').post(LoginUser)
UserRouter.route('/manageAccess').post(ModuleAccess)
UserRouter.route('/getAllUser').get(GetAllUser)
UserRouter.route('/getOneUser/:id').get(getOneUser)
UserRouter.route('/setAllModule').post(SetAllModule)
UserRouter.route('/getAllModule').get(GetAllModule)

export { UserRouter };
