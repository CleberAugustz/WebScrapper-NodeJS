import Sequelize from "sequelize";
import path from "path";

let database = null;

const loadModels = (sequelize) => {
  const dir = path.join(__dirname, "./../models/");
  const models = [];

  const filePages = path.join(dir, "pages");
  const fileProducts = path.join(dir, "products");
  const modelPages = require(filePages)(sequelize, Sequelize);
  const modelProducts = require(fileProducts)(sequelize, Sequelize);

  models[modelPages.name] = modelPages;
  models[modelProducts.name] = modelProducts;

  return models;
};

export default (config) => {
  if (!database) {
    const op = Sequelize.Op;
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.params.host,
        dialect: config.params.dialect,
        operatorsAliases: op,
        logging: false,
      }
    );

    database = {
      sequelize,
      Sequelize,
      models: {},
    };

    database.models = loadModels(sequelize);
    console.log(database.models);

    sequelize.sync().then(() => database);
  }

  return database;
};
