const express = require('express');
const toDoController = require('../controllers/toDoControllers');
const checkSession = require('../middleware/checkSession')

const toDoRouter = express.Router();

toDoRouter.post('/addToDo', checkSession, toDoController.postAddToDo)
toDoRouter.get('/toDoList', toDoController.getToDoList)
toDoRouter.put(`/editToDo/:_id`, toDoController.putEditToDo)
toDoRouter.patch(`/editToDoStatus/:_id`, toDoController.patchUpdateToDoStatus)
toDoRouter.delete(`/deleteToDo/:_id`, toDoController.deleteDeleteToDo)

module.exports = toDoRouter;