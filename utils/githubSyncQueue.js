import { Queue } from "bullmq";
import { connection } from "../config/bullmqRedis.js";

export const githubSyncQueue = new Queue('github_sync',{
    connection
})