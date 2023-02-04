import { SlashCreator, FastifyServer } from "slash-create";
import "dotenv/config";

import { commands } from "./commands/index.js";
import { EventListener } from "./events.js";

export const creator = await new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  client: process.env.DISCORD_GUILD,
  serverHost: "0.0.0.0",
});

EventListener(creator);
await creator.withServer(new FastifyServer()).registerCommands(commands).startServer();
await creator.syncCommandsIn(process.env.DISCORD_GUILD);

console.log(`Starting server at "${creator.options.serverHost}:${creator.options.serverPort}/interactions"`);
