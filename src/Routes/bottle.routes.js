import express from 'express';

import {GenerateBottle,GetBottle} from '../Controller/bottle.controller.js';

const BottleRouter = express.Router();


BottleRouter.route('/generateBottles').post(GenerateBottle);
BottleRouter.route('/getBottles').get(GetBottle);


export {BottleRouter}