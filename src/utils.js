import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const defaultURL = import.meta.url;

export const FILENAME = (url = defaultURL) => fileURLToPath(url);
export const DIRNAME = (url = defaultURL) => dirname(FILENAME(url));
