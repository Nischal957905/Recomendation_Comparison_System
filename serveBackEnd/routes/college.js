/*
This file consists of different route per specific page. These routes will be utilized as a rest
api to connect mongo with fron-end react
*/

//necessary imports of epress modules and libraires including other custom made files
import express from 'express'
import collegeController from '../controller/CollegeController.js'

//Initilization of express router modules to gain access to router
const modemRoute = express.Router();

//Declaration of the routes for this specific page pointing towards a method present in the controller
modemRoute.route('/')
    .get(collegeController.getCollegeList)

modemRoute.route('/:college')
    .get(collegeController.getSingleCollege)
    //exporting the router instance to utilize in the main app
export default modemRoute;