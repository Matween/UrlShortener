'use strict';

const express = require('express');
const UrlsRouter = express.Router();

const { UrlsController } = require('../controllers');
const { JwtMiddleware } = require('../middleware');

UrlsRouter.route('/')
  .post(JwtMiddleware.verify, UrlsController.create);
UrlsRouter.route('/user/:userId')
.get(JwtMiddleware.verify, UrlsController.list)
  UrlsRouter.route('/:id')
  .head(JwtMiddleware.verify, UrlsController.exists)
  .get(JwtMiddleware.verify, UrlsController.find);

module.exports = UrlsRouter;
