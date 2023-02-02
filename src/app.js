import { SlashCreator, FastifyServer } from "slash-create";
import "dotenv/config";

import { commands } from "./commands/index.js";
import { raid_boss_interaction } from "./commands/raid_boss_checker.js";

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  client: process.env.DISCORD_GUILD,
  serverHost: "0.0.0.0",
});

creator.on("debug", (message) => console.log("[DEBUG]", message));
creator.on("warn", (message) => console.warn("[WARN]", message));
creator.on("error", (error) => console.error("[ERROR]", error));
creator.on("synced", () => console.info("Commands synced!"));
creator.on("commandRun", (command, _, ctx) =>
  console.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`)
);
creator.on("commandRegister", (command) => console.info(`Registered command ${command.commandName}`));
creator.on("commandError", (command, error) => console.error(`Command ${command.commandName}:`, error));

creator.on("componentInteraction", (ctx) => {
  const { name } = ctx.message.interaction;
  if (name === "raid") return raid_boss_interaction(ctx);
});

await creator.withServer(new FastifyServer()).registerCommands(commands).startServer();
await creator.syncCommandsIn(process.env.DISCORD_GUILD);

console.log(`Starting server at "${creator.options.serverHost}:${creator.options.serverPort}/interactions"`);
