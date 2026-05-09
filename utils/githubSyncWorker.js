import { Worker } from "bullmq";
import { GithubConnection } from "../models/index.js";
import { connection } from "../config/bullmqRedis.js";

export const worker = new Worker(
  "github_sync",
  async (job) => {

    const { connectionId } = job.data;

    const githubConnection =
      await GithubConnection.findByPk(connectionId);

    const { access_token } = githubConnection;

    const response = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const repositories = response.data.map(repo => ({
      github_repo_id: repo.id,
      connection_id: connectionId,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      stars: repo.stargazers_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at
    }));

    await Repository.bulkCreate(repositories, {
      updateOnDuplicate: [
        'name',
        'full_name',
        'private',
        'stars',
        'updated_at'
      ]
    });

    githubConnection.last_sync_at = new Date();

    await githubConnection.save();
  },
  {
    connection
  }
);