const express = require('express');
const userController = require('../controllers/userControllers');

const userRouter = express.Router();

userRouter.post('/addToDo', userController.postAddToDo)
userRouter.get('/toDoList', userController.getToDoList)

module.exports = userRouter;