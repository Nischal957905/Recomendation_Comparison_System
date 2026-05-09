import express from 'express'
import adminController from '../controller/admin/AdminController.js'

const router = express.Router()

router.route('/')
    .get(adminController.getAdminShowCase)

router.route('/user')
    .get(adminController.getUserList)

router.route('/new/college')
    .post(adminController.createCollege)

router.route('/new/school')
    .post(adminController.createSchool)

router.route('/new/consultancy')
    .post(adminController.createConsultancy)

router.route('/delete')
    .delete(adminController.deleteInstitution)

router.route('/edit/institution/:institution')
    .post(adminController.editConsultancy)

router.route('/edit/school/:institution')
    .post(adminController.editSchool)

router.route('/edit/college/:institution')
    .post(adminController.editCollege)

router.route('/edit/user/:institution')
    .post(adminController.editPost)

router.route('/active')
    .post(adminController.inactivateUser)

export default router
