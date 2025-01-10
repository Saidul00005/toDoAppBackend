import express from 'express';
import * as userController from '../controllers/userController.js';
import checkSession from '../middleware/checkSession.js';

const userRouter = express.Router();

userRouter.post('/signUp', userController.postSignUp)
userRouter.post('/login', userController.postLogIn)
userRouter.post('/refresh-token', userController.postRefreshToken);
userRouter.get('/verifyEmail', userController.getVerifyEmail)
userRouter.get('/userProfile', checkSession, userController.getUserProfile)
userRouter.put('/updateUserProfile', checkSession, userController.putUpdateUserProfile)

export default userRouter;