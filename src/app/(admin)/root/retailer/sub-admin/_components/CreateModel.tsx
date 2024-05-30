// 'use client';
// import { Form, Formik } from 'formik';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { Button } from 'rizzui';
// import * as Yup from 'yup';

// const validationSchema = Yup.object().shape({
//   name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
//   address: Yup.string().min(2, 'Too Short!').max(150, 'Too Long!').required('This field is required'),
// });

// const initialValues = {
//   name: '',
//   address: '',
//   longitude: '',
//   latitude: '',
//   status: true, // true and false
// };

// import InputField from '@/components/Formik/ImputField';
// import StatusBar from '@/components/Formik/StatusBar';
// import { routes } from '@/config/routes';
// import { useCreateBranchMutation } from '@/features/retailer/branch/branchApi';
// import { Branch } from '@/types';
// import toast from 'react-hot-toast';
// import { ImSpinner9 } from 'react-icons/im';
// import MapComponent from './Map';

// export default function CreateBranch() {
//   const [submitting, setSubmitting] = useState(false);
//   const [createBranch] = useCreateBranchMutation();
//   const router = useRouter();

//   const handleSubmit = async (values: Branch) => {
//     try {
//       setSubmitting(true);
//       console.log('Creating branch:', values);
//       const result = await createBranch(values).unwrap();
//       // routes.push(routes.retailer.branch.home);
//       router.push(routes.retailer.branch.home);
//       toast.success('Branch created successfully!');
//     } catch (error) {
//       console.error('Failed to create branch:', error);
//       toast.error('Failed to create branch. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={(values) => {
//           // same shape as initial values
//           // console.log(values, 'value');

//           handleSubmit(values);
//         }}
//       >
//         {({ errors, touched, setFieldValue }) => (
//           <Form className="mt-5 grid gap-4">
//             <InputField name="name" label="Name" placeholder="" errors={errors.name} touched={touched.name} />
//             <MapComponent setFieldValue={setFieldValue} errors={errors.address} touched={touched.address} />
//             {/* <Switch label="Status" variant="outline" labelPlacement="right" className="hover" /> */}
//             <StatusBar setFieldValue={setFieldValue} />
//             <div className="justify-end">
//               <Button
//                 type="submit"
//                 className="flex w-full items-center justify-center bg-indigo-500 text-sm font-semibold text-white disabled:bg-[#1d58d8]"
//                 size="lg"
//                 disabled={submitting}
//               >
//                 {submitting ? (
//                   <span className="flex items-center gap-x-2">
//                     Requesting... <ImSpinner9 className="animate-spin text-base" />
//                   </span>
//                 ) : (
//                   <span>Submit</span>
//                 )}
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }
'use client';
import { useState } from 'react';
import { Modal, Button, Text, ActionIcon, Input, Password, Checkbox } from 'rizzui';
import { RxCross2 } from 'react-icons/rx';

export default function CreateModel() {
  const [modalState, setModalState] = useState(false);
  return (
    <>
      <Button onClick={() => setModalState(true)}>Custom Style Modal</Button>
      <Modal
        isOpen={modalState}
        onClose={() => setModalState(false)}
        overlayClassName="backdrop-blur"
        containerClassName="!max-w-4xl !shadow-2xl"
      >
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-7 flex items-center justify-between">
            <Text>Welcome to RizzUI</Text>
            <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
              <RxCross2 className="h-auto w-6" strokeWidth={1.8} />
            </ActionIcon>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-6 [&_label>span]:font-medium">
            <Input label="First Name *" inputClassName="border-2" size="lg" />
            <Input label="Last Name *" inputClassName="border-2" size="lg" />
            <Input label="Email *" inputClassName="border-2" size="lg" className="col-span-2" />
            <Password label="Password *" inputClassName="border-2" size="lg" className="col-span-2" />
            <Password label="Confirm Password *" inputClassName="border-2" size="lg" className="col-span-2" />
            <Checkbox
              size="lg"
              inputClassName="border-2"
              className="col-span-2"
              label={
                <Text className="text-sm">
                  I agree to RizzUI&lsquo;s <a className="underline">Terms of Service</a> and <a className="underline">Privacy Policy</a>
                </Text>
              }
            />
            <Button type="submit" size="lg" className="col-span-2 mt-2" onClick={() => setModalState(false)}>
              Create an Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
