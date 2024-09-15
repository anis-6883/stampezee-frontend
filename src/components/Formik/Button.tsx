import React from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { Tooltip } from 'rizzui';

const buttonStyles: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:shadow-blue-800/80 dark:focus:ring-blue-800',
  warning:
    'bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 text-white hover:bg-gradient-to-br focus:ring-orange-300 dark:shadow-orange-800/80 dark:focus:ring-orange-800',
  danger:
    'bg-gradient-to-r from-red-500 via-red-600 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:shadow-red-800/80 dark:focus:ring-red-800',
  disabled:
    'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-600 text-white hover:bg-gradient-to-br focus:ring-gray-300 dark:shadow-gray-800/80 dark:focus:ring-gray-800',
  outline:
    'text-black border border-[#DC3545] hover:bg-gradient-to-br hover:from-red-500 hover:via-red-600 hover:to-red-600 hover:text-white focus:ring-red-300 shadow-none',
};

interface ButtonProps {
  text?: string;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' | 'disabled';
  preIcon?: React.ReactNode;
  postIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isSubmitting?: boolean;
  onClick?: (data: any) => void;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = 'primary',
  preIcon,
  postIcon,
  type = 'button',
  isSubmitting = false,
  onClick,
  className = '',
  disabled = false,
  tooltip,
}) => {
  const baseStyles = `justify-center flex items-center gap-2 rounded-lg text-center text-sm font-medium shadow-lg focus:outline-none focus:ring-4 ${className}`;
  const paddingStyles = text ? 'mb-2 me-2 px-5 py-2.5' : preIcon ? 'px-3 py-2' : '';

  return (
    <Tooltip
      color="danger"
      className={`${tooltip === 'Details' ? 'bg-primary' : tooltip === 'Edit' ? 'bg-warning' : 'bg-danger'} text-white ${tooltip ? '' : 'hidden'}`}
      size="sm"
      placement="top"
      content={tooltip}
      arrowClassName={`${tooltip === 'Details' ? 'fill-primary' : tooltip === 'Edit' ? 'fill-warning' : 'fill-danger'}`}
    >
      <button
        onClick={onClick}
        disabled={isSubmitting || disabled}
        type={type}
        className={`${baseStyles} ${paddingStyles} ${buttonStyles[disabled ? 'disabled' : color] || ''} ${(isSubmitting || disabled) && 'cursor-not-allowed'}`}
      >
        {preIcon} {text} {isSubmitting ? <ImSpinner9 className="animate-spin text-base" /> : postIcon}
      </button>
    </Tooltip>
  );
};

export default Button;
