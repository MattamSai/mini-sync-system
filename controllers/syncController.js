import syncModel from "../models/syncModel.js";
import { githubSyncQueue } from "../utils/githubSyncQueue.js";

class Sync {

    static async syncRepo(req, res) {

        try {

            const connectionId = 5;

            const sync = await syncModel.create({
                connectionId,
                status: "queued",
                sync_started_at: new Date(),
            });

            await githubSyncQueue.add(
                "github_repo_sync",
                {
                    connectionId,
                    syncId: sync.id
                }
            );

            return res.status(200).json({
                success: true,
                message: "Repository sync queued successfully"
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default Sync;