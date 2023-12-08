"use strict";
import { Model } from "sequelize";
import { TableProperties } from "../config/db-tables-properties";

interface UsersAttribute {
  id: number;
  photo: string;
  names: string;
  surnames: string;
  email: string;
  country: string;
  city: string;
  phone: string;
  cityId: number;
  countryId: number;
  stateId: number;
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (sequelize: any, Sequelize: any) => {
  class Users extends Model<UsersAttribute> implements UsersAttribute {
    id: number;
    photo: string;
    names: string;
    surnames: string;
    email: string;
    country: string;
    city: string;
    phone: string;
    cityId: number;
    countryId: number;
    stateId: number;
    createdAt: Date;
    updatedAt: Date;

    static associate(models: any) {
      Users.hasMany(models.Subcription, {
          foreignKey: 'id_user',
      });

      Users.hasMany(models.Orders, {
        foreignKey: 'id_user',
      });

      Users.hasMany(models.Videos, {
        foreignKey: 'id_user',
        foreignKeyConstraint: true
    });
  }
  }

  Users.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      photo: {
        type: Sequelize.STRING(200),
        defaultValue: "URL_FOTO",
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      lastName: {
        field: "last_name",
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "NA",
      },

      state: {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: "NA",
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "NA",
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
     
      countryId: {
        field: "country_id",
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      stateId: {
        field: "state_id",
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      cityId: {
        field: "city_id",
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      token: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      bike: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      walk: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      all: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      newUser: {
        field:"new_user",
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: TableProperties.UsersTable.MODEL,
      tableName: TableProperties.UsersTable.NAME,
      indexes: [
        {
          fields: ["email"],
          name: TableProperties.UsersTable.EMAIL_INDEX,
          unique: true,
        },
      ],
    }
  );

  return Users;
};
