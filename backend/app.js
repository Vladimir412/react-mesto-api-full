/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const path = require('path');
const {
  routerGetUsers,
  routerGetUserById,
  routerRegister,
  routerUpadateInfoUser,
  routerUpdateAvatarUser,
  routerLoginUser,
  routerGetInfoAboutUser,
} = require('./routes/users');
const {
  routerCardsGet,
  routerCardPost,
  routerCardDelete,
  routerAddCardLike,
  routerDeleteCardLike,
} = require('./routes/cards');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'http://mesto-vladimir.nomoredomains.rocks',
  'http://mesto-vladimir.nomoredomains.rocks/login',
  'http://mesto-vladimir.nomoredomains.rocks/signup',
  'http://mesto-vladimir.nomoredomains.rocks/users',
  'http://mesto-vladimir.nomoredomains.rocks/cards',
  'http://mesto-vladimir.nomoredomains.rocks/main',
  'https://mesto-vladimir.nomoredomains.rocks',
  'https://mesto-vladimir.nomoredomains.rocks/signin',
  'https://mesto-vladimir.nomoredomains.rocks/signup',
  'https://mesto-vladimir.nomoredomains.rocks/users',
  'https://mesto-vladimir.nomoredomains.rocks/cards',
  'https://mesto-vladimir.nomoredomains.rocks/main',
  'localhost:3000/signin',
  'localhost:3000/signup',
  'localhost:3000/users',
  'localhost:3000/cards',
  'localhost:3000/main',
];

const app = express();
app.use(cors());
app.options('*', cors());
const {
  PORT = 3000,
} = process.env;
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
//   // useCreateIndex: true,
//   // useFindAndModify: false,
});
app.use(express.static(path.join(__dirname, 'express-mesto')));

app.use(requestLogger);

app.use((req, res, next) => {
  const { origin } = req.headers;
  // const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', "authorization, Content-Type");
    // res.header('Access-Control-Allow-Headers', requestHeaders);
  }

  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.headers('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }

  next();
});

app.use(routerRegister);
app.use(routerLoginUser);

app.use(auth);

app.use(routerGetUsers);
app.use(routerGetUserById);
app.use(routerUpadateInfoUser);
app.use(routerUpdateAvatarUser);
app.use(routerGetInfoAboutUser);

app.use(routerCardsGet);
app.use(routerCardPost);
app.use(routerCardDelete);
app.use(routerAddCardLike);
app.use(routerDeleteCardLike);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка!'
        : message,
    });
});

app.listen(PORT, () => {});
