'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { Button as RizButton } from 'rizzui';

interface ICommonProps {
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
  variant?: 'solid' | 'flat' | 'outline' | 'text' | undefined;
  className?: string;
}

interface IButtonProps extends ICommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  startIcon?: React.ReactNode | null;
  endIcon?: React.ReactNode | null;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button component for use in React applications, built on top of Rizzui Button.
 *
 * @component Button
 *
 * @param {string} text - The text content of the button.
 * @param {React.ReactNode | null} startIcon - Icon or element to be displayed before the text.
 * @param {React.ReactNode | null} endIcon - Icon or element to be displayed after the text.
 * @param {string} [className=""] - Additional CSS class names for the button.
 * @param {"solid" | "flat" | "outline" | "text" | undefined} [variant] - The visual style of the button.
 * @param {"sm" | "md" | "lg" | "xl" | undefined} [size] - The size of the button.
 * @param {boolean} [isLoading=false] - If true, displays a loading state in the button.
 * @param {boolean} [disabled=false] - If true, disables the button.
 * @param {"button" | "submit" | "reset"} [type="button"] - The type of the button.
 * @param {...ButtonHTMLAttributes<HTMLButtonElement>} [rest] - Additional HTML button attributes.
 *
 * @example
 * // Basic usage
 * <Button text="Click me" />
 *
 * @example
 * // Button with a start icon
 * <Button text="Save" startIcon={<SaveIcon />} />
 *
 * @example
 * // Button with an end icon, large size, and outline variant
 * <Button text="Submit" endIcon={<SubmitIcon />} size="lg" variant="outline" />
 *
 * @example
 * // Loading state button with custom class
 * <Button text="Loading..." isLoading />
 *
 * @returns {JSX.Element} - A React JSX element representing the button.
 */

export default function Button({
  text = '',
  startIcon = null,
  endIcon = null,
  className = '',
  variant = undefined,
  size = undefined,
  isLoading = false,
  disabled = false,
  type = 'button',
  ...rest
}: IButtonProps): JSX.Element {
  const buttonProps: ICommonProps = {
    className,
    variant,
    size,
    isLoading,
    disabled,
    ...rest,
  };

  return (
    <RizButton type={type} {...buttonProps}>
      {startIcon && startIcon}
      <span>{text}</span>
      {endIcon && endIcon}
    </RizButton>
  );
}
