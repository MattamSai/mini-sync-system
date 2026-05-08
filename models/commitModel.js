import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Commit = sequelize.define(
    "Commit",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      github_commit_sha: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      repository_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      author_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      commit_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "commits",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return Commit;
};