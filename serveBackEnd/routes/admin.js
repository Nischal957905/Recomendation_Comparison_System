/*
This file consists of different route per specific page. These routes will be utilized as a rest
api to connect mongo with fron-end react
*/

//necessary imports of epress modules and libraires including other custom made files
import express from 'express'
import AdminController from '../controller/admin/AdminController.js';
import multer from 'multer';

//Initilization of express router modules to gain access to router
const modemRoute = express.Router();
const upload = multer({ dest: 'public/images' }); 

//Declaration of the routes for this specific page pointing towards a method present in the controller
modemRoute.route('/')
    .get(AdminController.getAdminShowCase)

modemRoute.route('/delete')
    .delete(AdminController.deleteInstitution)

modemRoute.route('/upload')
    .post(upload.single('image'),AdminController.upload)

modemRoute.route('/new/college/')
    .post(AdminController.createCollege)

modemRoute.route('/edit/college/:institution')
    .post(AdminController.editCollege)

modemRoute.route('/edit/school/:institution')
    .post(AdminController.editSchool)

modemRoute.route('/edit/institution/:institution')
    .post(AdminController.editConsultancy)

modemRoute.route('/edit/user/:institution')
    .post(AdminController.editPost)

modemRoute.route('/new/school')
    .post(AdminController.createSchool)

modemRoute.route('/new/consultancy')
    .post(AdminController.createConsultancy)

modemRoute.route('/user')
    .get(AdminController.getUserList)

modemRoute.route('/active')
    .post(AdminController.inactivateUser)

export default modemRoute;