import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const defaultURL = import.meta.url;
export const FILENAME = (url = defaultURL) => fileURLToPath(url);
export const DIRNAME = (url = defaultURL) => dirname(FILENAME(url));

export const findComponent = (arr, val) => {
  for (const obj of arr) {
    if (obj.custom_id === val) return obj;

    if (obj.components) {
      const result = findComponent(obj.components, val);
      if (result) return result;
    }
  }
  return undefined;
};
