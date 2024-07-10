import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';

export default function S3BucketForm() {
  return (
    <FormBlockWrapper title="AWS S3 Bucket Credentials" className="p-5">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
        <InputField name="s3Bucket.awsRegion" label="AWS Region" placeholder="aws region" required={false} />
        <InputPassword name="s3Bucket.awsAccessKeyId" label="AWS Access Key Id" placeholder="******" required={false} />
        <InputPassword name="s3Bucket.awsSecretAccessKey" label="AWS Secret Access Key" placeholder="******" required={false} />
        <InputField name="s3Bucket.awsBucketName" label="AWS Bucket Name" placeholder="aws-s3" required={false} />
      </div>
    </FormBlockWrapper>
  );
}
