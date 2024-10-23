export default function objectToFormData(obj: any, ignore: string[] | null | undefined = []) {
  const formData = new FormData();

  if (!Array.isArray(ignore)) {
    ignore = [];
  }

  Object.keys(obj).forEach((key: any) => {
    if (!ignore.includes(key) && obj[key] !== '') {
      if (Array.isArray(obj[key])) {
        // for (var i = 0; i < obj[key].length; i++) {
        //   // @ts-ignore
        //   formData.append(`${key}[]`, obj[key][i]);
        // }
        obj[key].forEach((item: any, index: number) => {
          if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach((subKey) => {
              formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
            });
          } else {
            formData.append(`${key}[]`, item);
          }
        });
      } else {
        formData.append(key, obj[key]);
      }
    }
  });

  return formData;
}
