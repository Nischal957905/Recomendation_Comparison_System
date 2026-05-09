import express from 'express'
import schoolController from '../controller/SchollController.js'

const router = express.Router()

router.route('/')
    .get(schoolController.getSchoolList)

router.route('/:school')
    .get(schoolController.getSingleSchool)

export default router
