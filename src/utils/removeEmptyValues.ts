type InputObject = { [key: string]: any };

export default function removeEmptyValues(obj: InputObject) {
  // Create a new object to avoid mutating the original one
  const newObj: any = {};

  // Iterate over the keys of the object
  for (const key in obj) {
    // Check if the property belongs to the object and not its prototype
    if (obj.hasOwnProperty(key)) {
      // If the value is not empty, add it to the new object
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        newObj[key] = obj[key];
      }
    }
  }

  return newObj;
}
