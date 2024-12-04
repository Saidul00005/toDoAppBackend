const express = require('express');
const userController = require('../controllers/userControllers');

const userRouter = express.Router();

userRouter.post('/addToDo', userController.postAddToDo)
userRouter.get('/toDoList', userController.getToDoList)
userRouter.put(`/editToDo/:_id`, userController.putEditToDo)

module.exports = userRouter;