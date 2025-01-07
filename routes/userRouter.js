import express from 'express';
import * as userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signUp', userController.postSignUp)
userRouter.post('/login', userController.postLogIn)
userRouter.post('/refresh-token', userController.postRefreshToken);
userRouter.get('/verify-email', userController.getVerifyEmail)

export default userRouter;