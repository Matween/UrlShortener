'use strict';
const { foreign_key } = require('inflection');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Url.belongsTo(models.User,{foreignKey: 'userId'});
    }
  };
  Url.init({
    url: DataTypes.TEXT,
    short: {
      type: DataTypes.STRING,
      unique: true,
    },
    userId: DataTypes.INTEGER,
    clicked: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastAccess: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Url',
  });

  return Url;
};