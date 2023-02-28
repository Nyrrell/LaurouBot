import { SlashCreator, GatewayServer } from "slash-create";
import Eris from "eris";
import "dotenv/config";

import { commands } from "./commands/index.js";
import { clientEventLiestener, EventListener } from "./events.js";

export const client = new Eris(process.env.DISCORD_BOT_TOKEN);

export const creator = await new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  client,
});

creator.guildId = process.env.DISCORD_GUILD;

EventListener(creator);
await creator
  .withServer(new GatewayServer((handler) => clientEventLiestener(client, handler)))
  .registerCommands(commands);
await creator.syncCommandsIn(process.env.DISCORD_GUILD);

await client.connect();
