import { Cron } from "croner";

import { youtubeFeed } from "./youtube_task.js";

// At 1 minutes past the hour
Cron("1 * * * *", async () => {
  await youtubeFeed();
});
