// utils/getChangedFields.ts

export const getChangedFields = (values: any, initialValues: any): any => {
  return Object.keys(values).reduce((acc, key) => {
    if (values[key as keyof any] !== initialValues[key as keyof any]) {
      acc[key as keyof any] = values[key as keyof any];
    }
    return acc;
  }, {} as any);
};
