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

/**
 * Convert Color to ansi Color.
 * @param {string} string - String to color
 * @param {('gray'|'red'|'green'|'yellow'|'blue'|'pink'|'cyan'|'white')} color - Available color
 * @param {(0|1|4)} format - (normal|bold|underline)
 */
export const ansiColor = (string, color, format = 0) => {
  const colours = {
    gray: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    pink: 35,
    cyan: 36,
    white: 37,
  };

  return `\u001b[${format};${colours[color]}m${string}\u001b[0m`;
};
