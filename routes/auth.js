const express = require('express');
const {
  signUpController,
  logOutController,
  loginController,
  verifyUserController,
} = require('./../controllers/authControllers');

const authRouter = express.Router();
authRouter.post('/signup', signUpController);
authRouter.post('/login', loginController);
authRouter.get('/logout', logOutController);
authRouter.get('/verifyuser', verifyUserController);

module.exports = authRouter;
