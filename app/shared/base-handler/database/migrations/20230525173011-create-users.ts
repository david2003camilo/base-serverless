import { TableProperties } from "../config/db-tables-properties";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable(TableProperties.UsersTable.NAME, {
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
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "NA",
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
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
    });
    await queryInterface.addIndex(TableProperties.UsersTable.NAME, {
      fields: ["email"],
      name: TableProperties.UsersTable.EMAIL_INDEX,
      unique: true,
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeIndex(TableProperties.UsersTable.NAME, TableProperties.UsersTable.EMAIL_INDEX);
    await queryInterface.dropTable(TableProperties.UsersTable.NAME);
  },
};
