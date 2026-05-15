/*
This file consists of different route per specific page. These routes will be utilized as a rest
api to connect mongo with fron-end react
*/

//necessary imports of epress modules and libraires including other custom made files
import express from 'express'
import AdminController from '../controller/admin/AdminController.js';
import multer from 'multer';
import { extname } from 'path';
import { requireAdmin } from '../middleware/auth.js';

//Initilization of express router modules to gain access to router
const modemRoute = express.Router();
const upload = multer({
    dest: 'public/images',
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
        const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
        const extension = extname(file.originalname || '').toLowerCase();

        if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
            return callback(null, true);
        }

        callback(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.'));
    },
});

modemRoute.use(requireAdmin);

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
