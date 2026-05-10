/*
This file consists of different route per specific page. These routes will be utilized as a rest
api to connect mongo with fron-end react
*/

//necessary imports of epress modules and libraires including other custom made files
import express from 'express'
import PostController from '../controller/posts/PostController.js';

//Initilization of express router modules to gain access to router
const modemRoute = express.Router();

//Declaration of the routes for this specific page pointing towards a method present in the controller
modemRoute.route('/')
    .get(PostController.getPostList)
    .post(PostController.createPost)

modemRoute.route('/user/post')
    .post(PostController.getUserPost)

modemRoute.route('/delete/post')
    .post(PostController.deletePost)
    
export default modemRoute;