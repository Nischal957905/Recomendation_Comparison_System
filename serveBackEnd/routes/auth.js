import express from 'express'
import authenticationController from '../controller/auth/AuthenticationController.js'

const router = express.Router()

router.route('/login')
    .post(authenticationController.verifyUser)

router.route('/register')
    .post(authenticationController.createUser)

export default router
