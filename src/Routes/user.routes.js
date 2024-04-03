import express from "express";
import { RegisterUser, LoginUser } from "../Controller/user.controller.js";
const UserRouter = express.Router();

UserRouter.route('/registerUser').post(RegisterUser);
UserRouter.route('/login').post(LoginUser)

export { UserRouter };
