import express from 'express';
import {
    GetMilkRequsition,
    GetMilkRequsitionById,
    RegisterMilkRequsition,
    DeleteMilkRequsition
} from '../Controller/requsition.controller.js'

const RequsitionRoute = express.Router();

RequsitionRoute.route('/registerMilkRequsition').post(RegisterMilkRequsition);
RequsitionRoute.route('/getMilkRequsition').get(GetMilkRequsition)
RequsitionRoute.route('/getMilkRequsitionById/:id').get(GetMilkRequsitionById)
RequsitionRoute.route('/deleteMilkRequsition/:id').delete(DeleteMilkRequsition)

export { RequsitionRoute}