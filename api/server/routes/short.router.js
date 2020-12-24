'use strict';

const express = require('express');
const ShortRouter = express.Router();

const { UrlsController } = require('../controllers');
const { JwtMiddleware } = require('../middleware');

ShortRouter.route('/').get((req, res) => {
  res.render('index', {title: 'UrlShortster'});
})

ShortRouter.route('/:short')
  .get(UrlsController.find);

ShortRouter.route('/:short/stats')
  .get(JwtMiddleware.verify, UrlsController.stats);

module.exports = ShortRouter;
