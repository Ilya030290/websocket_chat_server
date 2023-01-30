const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { showError } = require('./../helpers/functions');
const maxAge = 5 * 24 * 60 * 60;

const createJWT = (id) => {
  return jwt.sign({ id }, 'chat secret', {
    expiresIn: maxAge,
  });
};

const signUpController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const token = createJWT(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (error) {
    let errors = showError(error);
    res.status(400).json({ errors });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createJWT(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (error) {
    let errors = showError(error);
    res.status(400).json({ errors });
  }
};

const verifyUserController = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'chat secret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        let user = await User.findById(decodedToken.id);
        res.json(user);
        next();
      }
    });
  } else {
    next();
  }
};

const logOutController = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ logout: true });
};

module.exports = {
  signUpController,
  loginController,
  verifyUserController,
  logOutController,
};
