import { DataTypes } from "sequelize";

export default (sequelize) => {
  const GithubConnection = sequelize.define(
    "GithubConnection",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      github_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive", "failed"),
        defaultValue: "active",
      },

      last_synced_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "github_connections",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return GithubConnection;
};