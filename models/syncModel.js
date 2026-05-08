import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SyncJob = sequelize.define(
    "SyncJob",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      connection_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("running", "success", "failed"),
        defaultValue: "running",
      },

      sync_started_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      sync_completed_at: {
        type: DataTypes.DATE,
      },

      records_synced: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      error_message: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "sync_jobs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return SyncJob;
};