import { Sequelize } from "sequelize";

import UserModel from "./userModel.js";
import GithubConnectionModel from "./connnectionModel.js";
import SyncJobModel from "./syncModel.js";
import RepositoryModel from "./repoModel.js";
import CommitModel from "./commitModel.js";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const User = UserModel(sequelize);
const GithubConnection = GithubConnectionModel(sequelize);
const SyncJob = SyncJobModel(sequelize);
const Repository = RepositoryModel(sequelize);
const Commit = CommitModel(sequelize);



// Associations

User.hasMany(GithubConnection, {
  foreignKey: "user_id",
});

GithubConnection.belongsTo(User, {
  foreignKey: "user_id",
});

GithubConnection.hasMany(SyncJob, {
  foreignKey: "connection_id",
});

SyncJob.belongsTo(GithubConnection, {
  foreignKey: "connection_id",
});

GithubConnection.hasMany(Repository, {
  foreignKey: "connection_id",
});

Repository.belongsTo(GithubConnection, {
  foreignKey: "connection_id",
});

Repository.hasMany(Commit, {
  foreignKey: "repository_id",
});

Commit.belongsTo(Repository, {
  foreignKey: "repository_id",
});



export {
  sequelize,
  User,
  GithubConnection,
  SyncJob,
  Repository,
  Commit,
};