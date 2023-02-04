import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { DIRNAME } from "../utils.js";

const commandsDir = DIRNAME(import.meta.url);
const commandsFiles = await readdir(commandsDir);
const commands = [];

for (const file of commandsFiles) {
  if (file === "index.js") continue;

  const { default: Command } = await import(join(commandsDir, file));
  commands.push(Command);
}

export { commands };
