import { SlashCreator, FastifyServer } from "slash-create";
import { join } from "node:path";
import "dotenv/config";

import { DIRNAME } from "./utils.js";

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
});

creator.on("debug", (message) => console.log(message));
creator.on("warn", (message) => console.warn(message));
creator.on("error", (error) => console.error(error));
creator.on("synced", () => console.info("Commands synced!"));
creator.on("commandRun", (command, _, ctx) =>
  console.info(
    `${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`
  )
);
creator.on("commandRegister", (command) =>
  console.info(`Registered command ${command.commandName}`)
);
creator.on("commandError", (command, error) =>
  console.error(`Command ${command.commandName}:`, error)
);

await creator
  .withServer(new FastifyServer())
  .registerCommandsIn(join(DIRNAME(), "commands"))
  .syncCommands()
  .startServer();

console.log(
  `Starting server at "localhost:${creator.options.serverPort}/interactions"`
);
