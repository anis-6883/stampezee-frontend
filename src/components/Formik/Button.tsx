import { ImSpinner9 } from 'react-icons/im';
import { Button } from 'rizzui';

export default function SubmitButton({
  type = 'submit',
  text = 'Submit',
  loadingText = 'Please Wait...',
  isSubmitting = false,
  buttonClass = 'w-full h-[80%]',
}: {
  type?: 'submit' | 'button';
  text?: string;
  loadingText?: string;
  isSubmitting?: boolean;
  buttonClass?: string;
}) {
  return (
    <Button
      type={type}
      className={`${buttonClass} bg-indigo-500 text-sm font-semibold text-white disabled:bg-[#1d58d8]`}
      size="lg"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-x-2">
          {loadingText} <ImSpinner9 className="animate-spin text-base" />
        </span>
      ) : (
        <span>{text}</span>
      )}
    </Button>
  );
}
