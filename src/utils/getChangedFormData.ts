// utils/getChangedFields.ts

// export default function getChangedFormData = (values: any, initialValues: any): any => {
//   return Object.keys(values).reduce((acc, key) => {
//     if (values[key as keyof any] !== initialValues[key as keyof any]) {
//       acc[key as keyof any] = values[key as keyof any];
//     }
//     return acc;
//   }, {} as any);
// };

// v2==============

export default function getChangedFormData(values: any, initialValues: any, ignore: string[] | null | undefined = []): any {
  // Ensure ignore is an array
  if (!Array.isArray(ignore)) {
    ignore = [];
  }

  return Object.keys(values).reduce((acc, key) => {
    if (!ignore.includes(key) && values[key as keyof any] !== initialValues[key as keyof any]) {
      acc[key as keyof any] = values[key as keyof any];
    }
    return acc;
  }, {} as any);
}

// // Example usage
// const initialValues = { _id: '123', name: 'John Doe', image: 'path/to/image.jpg', age: 30 };
// const newValues = { _id: '123', name: 'Jane Doe', image: 'path/to/new-image.jpg', age: 30 };

// const changedData = getChangedFormData(newValues, initialValues, ['_id']);
// console.log(changedData); // Output: { name: 'Jane Doe' }
