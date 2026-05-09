import express from 'express'
import postController from '../controller/posts/PostController.js'

const router = express.Router()

router.route('/')
    .get(postController.getPostList)
    .post(postController.createPost)

router.route('/user/post')
    .post(postController.getUserPost)

router.route('/delete/post')
    .post(postController.deletePost)

export default router
