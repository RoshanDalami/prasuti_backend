import express from 'express';

import {GenerateBottle,GetBottle , updateBottleStatus , updateManyBottles } from '../Controller/bottle.controller.js';

const BottleRouter = express.Router();


BottleRouter.route('/generateBottles').post(GenerateBottle);
BottleRouter.route('/getBottles/:id').get(GetBottle);
BottleRouter.route('/updateStatus/:id').get(updateBottleStatus);
BottleRouter.route('/updateStatus').get(updateManyBottles);


export {BottleRouter}
