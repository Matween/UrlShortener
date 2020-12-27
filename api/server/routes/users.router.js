'use strict';

const express = require('express');
const UsersRouter = express.Router();

const { UsersController } = require('../controllers');
const { JwtMiddleware } = require('../middleware');

UsersRouter.route('/')
  .get(JwtMiddleware.verify, UsersController.list)
  .post(UsersController.create);

module.exports = UsersRouter;
