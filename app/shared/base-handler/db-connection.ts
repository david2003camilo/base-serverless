import { Op, Sequelize } from "sequelize";
import configDB from "./database/config/sequelizer-config-db.json";
import * as pg from "pg";

const NODE_ENV = process.env.NODE_ENV;
const dbConfig = configDB as any;

const connection = {
  isConnected: false,
};

let sequelize: any = null;
let DatabaseConnection: any = null;

const loadSequelize = async () => {
  sequelize = new Sequelize(
    `postgres://${dbConfig[NODE_ENV].username}:${dbConfig[NODE_ENV].password}@${dbConfig[NODE_ENV].host}:${dbConfig[NODE_ENV].port}/${dbConfig[NODE_ENV].database}`,
    {
      dialectModule: pg,
      pool: {
        max: 5, // Maximum number of connections in pool. Default is 5
        min: 0, // Minimum number of connections in pool. Default is 0
        idle: 300000, // The maximum time, in milliseconds, that a connection can be idle before being released
      },
    }
  );

  const Users = require("./database/models/Users")(sequelize, Sequelize);
  

  const DB: any = {
    sequelize: sequelize,
    Sequelize,
    Op,
    Users
  };

  Object.keys(DB).forEach((modelName) => {
    if (DB[modelName]?.associate) {
      DB[modelName].associate(DB);
    }
  });

  return DB;
};

export const connectToDB = async () => {
  if (connection.isConnected) {
    try {
      console.log("=> Using existing connection.");
      await sequelize.authenticate();
      return DatabaseConnection;
    } catch (error) {
      console.log("=> Error conection is closed");
      connection.isConnected = false;
    }
  }

  console.log("=> Created a new connection");
  DatabaseConnection = await loadSequelize();

  await sequelize.sync({ force: false });
  await sequelize.authenticate();
  connection.isConnected = true;
  console.log("=> New connection created");
  return DatabaseConnection;
};

export const closeConnectionDatabase = async () => {
  try {
    await sequelize.connectionManager.close();
  } catch (error) {
    console.log("Connection is already closed");
  }
};
