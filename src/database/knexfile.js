import { resolve } from "node:path";
import Knex from "knex";

import { DIRNAME } from "../utils.js";

export default Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: resolve(DIRNAME(), "../shared/database.sqlite"),
  },
  debug: Boolean(process.env.NODE_DEBUG),
  useNullAsDefault: true,
  migrations: {
    directory: "./migrations",
  },
  pool: {
    afterCreate: function (conn, cb) {
      conn.run("PRAGMA foreign_keys = ON", cb);
    },
  },
};
