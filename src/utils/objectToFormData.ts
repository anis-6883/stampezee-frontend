export default function objectToFormData(obj: any, ignore: string[] | null | undefined = []) {
  const formData = new FormData();

  // Ensure ignore is an array
  if (!Array.isArray(ignore)) {
    ignore = [];
  }

  Object.keys(obj).forEach((key) => {
    if (!ignore.includes(key) && obj[key] !== '') {
      if (Array.isArray(obj[key])) {
        for (var i = 0; i < obj[key].length; i++) {
          formData.append(`${key}[]`, obj[key][i]);
        }
      } else {
        formData.append(key, obj[key]);
      }
    }
  });

  return formData;
}

// Convert values object to FormData
// const formData = objectToFormData(values);

// formData ignore keys and field then use this function
// const createFormData = objectToFormData(values, ['_id']);
