import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Repository = sequelize.define(
    "Repository",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      github_repo_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      connection_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      private: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      stars: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "repositories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Repository;
};