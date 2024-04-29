import express from 'express'
import {
    GetTotalBaby
} from '../Controller/dashboard.controller.js';

const DashboardRouter = express.Router();

DashboardRouter.route('/getNumberOfBaby').get(GetTotalBaby);

export {DashboardRouter}