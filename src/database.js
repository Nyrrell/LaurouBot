import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Sequelize } from "sequelize";

import { DIRNAME } from "./utils.js";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./share/database.sqlite",
  logging: Boolean(process.env.NODE_DEBUG) && console.log,
});

const modelsPath = resolve(DIRNAME(), "models");
const modelsFiles = await readdir(modelsPath);

for (const file of modelsFiles) {
  const modelsName = file.slice(0, -3);
  const model = await import(join(modelsPath, file));
  model[modelsName].config(sequelize);
}
await sequelize.sync();
