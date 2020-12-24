'use strict';

const { Sequelize } = require('sequelize');
const { Url } = require('../models');

class UrlsRepository {

  constructor() {}

  findAllByUserId(userId) {
    return Url.findAll({
      where: {
        userId: userId
      }
    });
  }

  findById(id) {
    return Url.findByPk(id);
  }

  findOne(short) {
    return Url.findOne({
      where: { short: short }
    });
  }

  updateClicked(short) {
    const url = Url.update({clicked: Sequelize.literal('clicked + 1'), lastAccess: new Date()}, {
      returning: true,
      where: {
        short: short
      }
    });
    return Url.findOne({
        where: { short: short }
    });
  }

  save(url) {
    return Url.build(url).save()
      .then((url) => url)
      .catch((error) => new Promise((resolve, reject) => reject(error)));
  }

  exists(short) {
    return Url.count({
      where: { short: short }
    });
  }

}

module.exports = new UrlsRepository();
