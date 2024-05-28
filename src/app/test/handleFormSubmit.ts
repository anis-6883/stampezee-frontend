interface UserFormValues {
  name: string;
  email: string;
  password: string;
}

export const handleFormSubmit = async (
  values: UserFormValues,
  initialValues: UserFormValues,
  setSubmitting: (isSubmitting: boolean) => void
) => {
  // Find the changed fields
  const changedFields = Object.keys(values).reduce((acc, key) => {
    if (values[key as keyof UserFormValues] !== initialValues[key as keyof UserFormValues]) {
      acc[key as keyof UserFormValues] = values[key as keyof UserFormValues];
    }
    return acc;
  }, {} as Partial<UserFormValues>);

  console.log('Updating user data with:', changedFields);

  // Example API call
  await fetch('/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(changedFields),
  });

  setSubmitting(false);
};
