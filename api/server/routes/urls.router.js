'use strict';

const express = require('express');
const UrlsRouter = express.Router();

const { UrlsController } = require('../controllers');
const { JwtMiddleware } = require('../middleware');

UrlsRouter.route('/')
  .post(JwtMiddleware.verify, UrlsController.create)
  .patch(JwtMiddleware.verify, UrlsController.update);
UrlsRouter.route('/user')
.get(JwtMiddleware.verify, UrlsController.list)

module.exports = UrlsRouter;
