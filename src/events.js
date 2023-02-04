import { debuglog } from "node:util";

const debug = debuglog("dev");

export const EventListener = (creator) => {
  creator.on("warn", (message) => console.warn("[WARN]", message));
  creator.on("error", (error) => console.error("[ERROR]", error));
  creator.on("synced", () => console.info("[SYNCED]", "Commands synced!"));
  creator.on("commandRegister", (command) => console.info("[INFO]", `Registered command ${command.commandName}`));
  creator.on("commandError", (command, error) => console.error("[ERROR]", `Command ${command.commandName}:`, error));

  creator.on("componentInteraction", (ctx) => {
    const { name } = ctx.message.interaction;
    const command = ctx.creator.commands.find((command) => command.commandName === name);
    return command?.interaction(ctx);
  });

  // DEBUG PARTS
  creator.on("debug", (message) => debug("[DEBUG]", message));
  creator.on("commandRun", (command, _, ctx) =>
    debug(
      "[COMMAND_RUN]",
      `${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command /${command.commandName}`
    )
  );
};
