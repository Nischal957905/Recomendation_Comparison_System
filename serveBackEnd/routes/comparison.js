/*
This file consists of different route per specific page. These routes will be utilized as a rest
api to connect mongo with fron-end react
*/

//necessary imports of epress modules and libraires including other custom made files
import express from 'express'
import ComparisonController from '../controller/ComparisonController.js'

//Initilization of express router modules to gain access to router
const modemRoute = express.Router();

//Declaration of the routes for this specific page pointing towards a method present in the controller
modemRoute.route('/')
    .get(ComparisonController.getComparisonList)

modemRoute.route('/college/')
    .get(ComparisonController.getCollegeComparisonList)

modemRoute.route('/school/')
    .get(ComparisonController.getSchoolComparisonList)

modemRoute.route('/:institutions')
    .get(ComparisonController.getComparison)

export default modemRoute;