import toast from 'react-hot-toast';

/**
 * toaster function is used to show a toast
 * @param {string} args.type - recieves the type of the toast
 * @params {String} args.message - the message itself
 *
 */
const hotToast = (type: string, message: string) => {
  // @ts-ignore
  toast[type](message, { id: message });
};

export default hotToast;
