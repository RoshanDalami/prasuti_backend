
import express from 'express';
import {SearchDonor , SearchMilkVolume,SearchPasteurization,SearchRequsition} from '../Controller/search.controller.js';

const SearchRouter = express.Router();


SearchRouter.route('/searchDonor').get(SearchDonor)
SearchRouter.route('/searchMilkVolume').get(SearchMilkVolume)
SearchRouter.route('/searchPasteurization').get(SearchPasteurization)
SearchRouter.route('/searchRequsition').get(SearchRequsition)


export {SearchRouter}
