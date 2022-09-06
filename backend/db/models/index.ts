import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const basename = path.basename(__filename);
const setting = process.env.NODE_ENV || 'development';
import * as file from '../../config/database.json';

const db: {
  [key: string]: { associate?: (db: unknown) => void };
} = { Sequelize: { ...Sequelize, associate: undefined } };

const env: 'development' | 'production' | 'test' = setting as
  | 'development'
  | 'production'
  | 'test';

const config = file[env];

const sequelize = process.env.NODE_ENV
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    db[modelName].associate!(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
