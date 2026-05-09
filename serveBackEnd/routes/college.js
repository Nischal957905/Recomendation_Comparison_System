import express from 'express'
import collegeController from '../controller/CollegeController.js'

const router = express.Router()

router.route('/')
    .get(collegeController.getCollegeList)

router.route('/:college')
    .get(collegeController.getSingleCollege)

export default router
