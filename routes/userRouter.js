const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signUp', userController.postSignUp)
userRouter.post('/login', userController.postLogIn)



module.exports = userRouter;