'use strict';

const { User, Role } = require('../models');

class UsersRepository {

  constructor() {}

  findAll() {
    return User.findAll({
      attributes: {
        exclude: ['id', 'password']
      }
    });
  }

  findById(id) {
    return User.findByPk(id, {
      attributes: {
        exclude: ['id', 'password']
      }
    });
  }

  findOne(username) {
    return User.findOne({
      where: { username: username },
    });
  }

  save(user) {
    return User.build(user).save()
      .then((user) => user)
      .catch((error) => new Promise((resolve, reject) => reject(error)));
  }

  exists(id) {
    return User.count({
      where: { id: id }
    });
  }

}

module.exports = new UsersRepository();
