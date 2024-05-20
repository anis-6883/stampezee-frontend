'use client';

import QuillLoader from '@/components/reactQuill/QuillLoader';
import { routes } from '@/config/routes';
import { userFormValidation } from '@/config/validation';
import { useCreateUserMutation, useGetSingleUserQuery, useUpdateUserMutation } from '@/features/user/userApi';
import { Field, Form, Formik } from 'formik';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button, Input } from 'rizzui';

const QuillEditor = dynamic(() => import('@/components/reactQuill/QuillEditor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function CreateUser({ edit, id }: { edit?: boolean; id?: string }) {
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const { data } = useGetSingleUserQuery(id, { skip: !edit });
  const router = useRouter();

  const handleSubmit = (values: any) => {
    if (edit) {
      updateUser({ id, data: values })
        .then((res: any) => {
          if (res.data.status) router.push(routes.admin.user.home);
        })
        .catch((err: any) => console.log(err));
    } else {
      console.log('userValues', values);
      createUser(values)
        .then((res: any) => {
          if (res.data.status) router.push(routes.admin.user.home);
        })
        .catch((err: any) => console.log(err));
    }
  };

  let initialValues = {
    email: '',
    name: '',
    password: '',
  };

  if (edit) {
    initialValues = {
      ...data?.data?.user,
    };
  }

  return (
    <Formik initialValues={initialValues} validationSchema={userFormValidation} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue }) => (
        <Form>
          <Field name="email">
            {({ field, meta }: { field: any; meta: any }) => (
              <Input
                type="email"
                label={
                  <span className="mb-1 font-semibold">
                    Email
                    <span className="text-red-600">* {meta.touched && meta.error && <span>({meta.error})</span>}</span>
                  </span>
                }
                className="col-span-full"
                placeholder="jondoe@gmail.com"
                {...field}
              />
            )}
          </Field>
          <br />
          <Field name="name">
            {({ field, meta }: { field: any; meta: any }) => (
              <Input
                type="text"
                label={
                  <span className="mb-1 font-semibold">
                    Name
                    <span className="text-red-600">* {meta.touched && meta.error && <span>({meta.error})</span>}</span>
                  </span>
                }
                className="col-span-full"
                placeholder="Name"
                {...field}
              />
            )}
          </Field>
          {!edit && (
            <Field name="password">
              {({ field, meta }: { field: any; meta: any }) => (
                <Input
                  type="password"
                  label={
                    <span className="mb-1 font-semibold">
                      Password
                      <span className="text-red-600">* {meta.touched && meta.error && <span>({meta.error})</span>}</span>
                    </span>
                  }
                  className="col-span-full"
                  placeholder="****"
                  {...field}
                />
              )}
            </Field>
          )}

          <Button type="submit" className="mt-2">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}
