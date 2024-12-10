import express from 'express';
import * as toDoController from '../controllers/toDoControllers.js';
import checkSession from '../middleware/checkSession.js';


const toDoRouter = express.Router();

toDoRouter.post('/addToDo', checkSession, toDoController.postAddToDo)
toDoRouter.get('/toDoList', toDoController.getToDoList)
toDoRouter.put(`/editToDo/:_id`, toDoController.putEditToDo)
toDoRouter.patch(`/editToDoStatus/:_id`, toDoController.patchUpdateToDoStatus)
toDoRouter.delete(`/deleteToDo/:_id`, toDoController.deleteDeleteToDo)

export default toDoRouter;