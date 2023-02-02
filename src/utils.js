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
