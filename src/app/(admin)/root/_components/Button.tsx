import React from 'react';
import { ImSpinner9 } from 'react-icons/im';

const buttonStyles: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:shadow-blue-800/80 dark:focus:ring-blue-800',
  warning:
    'bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 text-white hover:bg-gradient-to-br focus:ring-orange-300 dark:shadow-orange-800/80 dark:focus:ring-orange-800',
  danger:
    'bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:shadow-red-800/80 dark:focus:ring-red-800',
};

interface ButtonProps {
  text?: string;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  preIcon?: React.ReactNode;
  postIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isSubmitting?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, color = 'primary', preIcon, postIcon, type = 'button', isSubmitting = false, onClick }) => {
  const baseStyles = 'flex items-center gap-2 rounded-lg text-center text-sm font-medium shadow-lg focus:outline-none focus:ring-4';
  const paddingStyles = text ? 'mb-2 me-2 px-5 py-2.5' : preIcon ? 'px-3 py-2' : '';

  return (
    <button
      onClick={onClick}
      disabled={isSubmitting}
      type={type}
      className={`${baseStyles} ${paddingStyles} ${buttonStyles[color] || ''} ${isSubmitting && 'cursor-not-allowed'}`}
    >
      {preIcon} {text} {isSubmitting ? <ImSpinner9 className="animate-spin text-base" /> : postIcon}
    </button>
  );
};

export default Button;
