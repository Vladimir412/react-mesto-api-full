/* eslint-disable consistent-return */
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const ErrorCantDeleteCardOtherUser = require('./errors/ErrorCantDeleteCardOtherUser');
const ErrorNotCorrectDataForLogin = require('./errors/ErrorNotCorrectDataForLogin');

module.exports = (req, res, next) => {
  const {
    authorization,
  } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorCantDeleteCardOtherUser('Авторизируйтесь');
  }
  const token = authorization.replace('Bearer ', '');

  let payloud;
  try {
    payloud = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new ErrorNotCorrectDataForLogin('Необходима авторизация'));
    next(err);
  }
  req.user = payloud;
  next();
};
