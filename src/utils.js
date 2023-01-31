import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

export const FILENAME = fileURLToPath(import.meta.url);
export const DIRNAME = dirname(FILENAME);
