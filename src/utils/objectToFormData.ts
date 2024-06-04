export default function objectToFormData(obj: any, ignore: string[] | null | undefined = []) {
  const formData = new FormData();

  // Ensure ignore is an array
  if (!Array.isArray(ignore)) {
    ignore = [];
  }

  Object.keys(obj).forEach((key) => {
    if (!ignore.includes(key)) {
      formData.append(key, obj[key]);
    }
  });

  return formData;
}

// Convert values object to FormData
// const formData = objectToFormData(values);

// formData ignore keys and field then use this function
// const createFormData = objectToFormData(values, ['_id']);
