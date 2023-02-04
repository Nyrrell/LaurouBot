import { debuglog } from "node:util";

import { raid_boss_interaction } from "./commands/raid_boss_checker.js";
import { test_interaction } from "./commands/test.js";

const debug = debuglog("dev");

export const EventListener = (creator) => {
  creator.on("warn", (message) => console.warn("[WARN]", message));
  creator.on("error", (error) => console.error("[ERROR]", error));
  creator.on("synced", () => console.info("[SYNCED]", "Commands synced!"));
  creator.on("commandRegister", (command) => console.info("[INFO]", `Registered command ${command.commandName}`));
  creator.on("commandError", (command, error) => console.error("[ERROR]", `Command ${command.commandName}:`, error));

  creator.on("componentInteraction", (ctx) => {
    const { name } = ctx.message.interaction;
    if (name === "raid") return raid_boss_interaction(ctx);
    if (name === "test") return test_interaction(ctx);
  });

  creator.on("debug", (message) => debug("[DEBUG]", message));
  creator.on("commandRun", (command, _, ctx) =>
    debug(
      "[COMMAND_RUN]",
      `${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command /${command.commandName}`
    )
  );
};
