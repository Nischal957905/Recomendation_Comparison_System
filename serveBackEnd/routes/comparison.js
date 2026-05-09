import express from 'express'
import comparisonController from '../controller/ComparisonController.js'

const router = express.Router()

router.route('/')
    .get(comparisonController.getComparisonList)

router.route('/college')
    .get(comparisonController.getCollegeComparisonList)

router.route('/school')
    .get(comparisonController.getSchoolComparisonList)

router.route('/:id')
    .get(comparisonController.getCompany)

export default router
