import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import Input from '@/components/shared/Form/Input';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';

export default function S3BucketForm() {
  return (
    <FormBlockWrapper title="AWS S3 Bucket Credentials">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
        {/* <Field name='awsRegion'>
          {({ field }: { field: any }) => <Input {...field} label={<span>AWS Region</span>} placeholder='AWS Region' />}
        </Field> */}

        {/* <Field name='awsAccessKeyId'>
          {({ field }: { field: any }) => <Input {...field} label={<span>AWS Access Key Id</span>} placeholder='AWS Access Key Id' />}
        </Field> */}

        {/* <Field name='awsSecretAccessKey'>
          {({ field }: { field: any }) => (
            <Input {...field} label={<span>AWS Secret Access Key</span>} placeholder='AWS Secret Access Key' />
          )}
        </Field> */}

        {/* <Field name='awsBucketName'>
          {({ field }: { field: any }) => <Input {...field} label={<span>AWS Bucket Name</span>} placeholder='AWS Bucket Name' />}
        </Field> */}

        <InputField name="s3Bucket.awsRegion" label="AWS Region" placeholder="aws region" required={false} />
        <InputPassword name="s3Bucket.awsAccessKeyId" label="AWS Access Key Id" placeholder="******" required={false} />
        <InputPassword name="s3Bucket.awsSecretAccessKey" label="AWS Secret Access Key" placeholder="******" required={false} />
        <InputPassword name="s3Bucket.awsBucketName" label="AWS Bucket Name" placeholder="******" required={false} />
      </div>
    </FormBlockWrapper>
  );
}
