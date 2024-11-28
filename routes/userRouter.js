const express = require('express');
const userController = require('../controllers/userControllers');

const userRouter = express.Router();

userRouter.post('/addToDo', userController.postAddToDo)

module.exports = userRouter;