import Knex from "knex";

import KnexConfig from "./knexfile.js";

export const database = Knex(KnexConfig);
