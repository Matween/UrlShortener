'use strict';
const express = require('express');
const Router = express.Router();

const AuthenticationRouter = require('./authentication.router');
const UsersRouter = require('./users.router');
const UrlsRouter = require('./urls.router');
const ShortRouter = require('./short.router');

const { JwtMiddleware } = require('../middleware');

Router.use('/auth', AuthenticationRouter);
Router.use('/users', JwtMiddleware.verify, UsersRouter);
Router.use('/url', JwtMiddleware.verify, UrlsRouter)

Router.use('/', ShortRouter);

module.exports = Router;
