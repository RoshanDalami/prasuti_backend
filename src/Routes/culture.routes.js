import {
    createCulture
} from '../Controller/culter.controller.js'
import express from 'express';

const CultureRoute = express.Router();

CultureRoute.route('/createCulture').post(createCulture);

export { CultureRoute}