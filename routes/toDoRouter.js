import express from 'express';
import * as toDoController from '../controllers/toDoControllers.js';
import checkSession from '../middleware/checkSession.js';


const toDoRouter = express.Router();

toDoRouter.post('/addToDo', checkSession, toDoController.postAddToDo)
toDoRouter.get('/toDoList', checkSession, toDoController.getToDoList)
toDoRouter.put(`/editToDo/:_id`, checkSession, toDoController.putEditToDo)
toDoRouter.patch(`/editToDoStatus/:_id`, checkSession, toDoController.patchUpdateToDoStatus)
toDoRouter.delete(`/deleteToDo/:_id`, checkSession, toDoController.deleteDeleteToDo)

export default toDoRouter;