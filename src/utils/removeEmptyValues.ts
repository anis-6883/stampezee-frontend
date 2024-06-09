type InputObject = { [key: string]: any };

export default function removeEmptyValues(obj: InputObject, removeKeys: string[] = []) {
  const newObj: any = {};

  // Copy non-empty values to newObj
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        newObj[key] = obj[key];
      }
    }
  }

  // Remove specified keys
  if (removeKeys.length > 0) {
    for (const key of removeKeys) {
      delete newObj[key];
    }
  }

  return newObj;
}
