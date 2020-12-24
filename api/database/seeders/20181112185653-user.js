'use strict';

const bcrypt = require('bcrypt');


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      { id: 1, username: 'admin', password: bcrypt.hashSync('admin', 10) },
      { id: 2, username: 'user', password: bcrypt.hashSync('user', 10) }
    ], {})
    .catch((error) => console.log(error));

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
