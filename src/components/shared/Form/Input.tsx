'use client';

import { ErrorMessage, Field, FieldProps } from 'formik';
import { capitalize } from 'lodash';
import { InputHTMLAttributes } from 'react';
import { Input as RizInput, InputProps as RizzInputProps } from 'rizzui';

interface ICommonInputProps {
  label?: string | null;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

//@ts-ignore
interface IInputProps extends ICommonInputProps, RizzInputProps, InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type?: 'text' | 'number' | 'email' | 'time' | 'date' | 'datetime-local' | 'month' | 'search' | 'tel' | 'url' | 'week';
}

/**
 * Input component for use in React applications, built on top of Rizzui Input.
 *
 * @component Input
 *
 * @param {string} name - The name of the input, used as the key for Formik state.
 * @param {string | null} [label=null] - The label text for the input.
 * @param {"text" | "number" | "email" | "time" | "date" | "datetime-local" | "month" | "search" | "tel" | "url" | "week"} [type="text"] - The type of the input.
 * @param {string} [placeholder=""] - The placeholder text for the input.
 * @param {boolean} [required=false] - If true, indicates that the input is required.
 * @param {string} [className=""] - Additional CSS class names for the input.
 * @param {...RizzInputProps} [rest] - Additional props for the underlying Rizzui Input component.
 *
 * @example
 * // Basic usage
 * <Input name="username" label="Username" placeholder="Enter your username" />
 *
 * @example
 * // Number input with required label and custom class
 * <Input name="age" type="number" label="Age" required className="custom-input" />
 *
 * @example
 * // Email input with default placeholder and optional label
 * <Input name="email" type="email" placeholder="user@example.com" />
 *
 * @returns {JSX.Element} - A React JSX element representing the input.
 */
export default function Input({
  name,
  label = null,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
  ...rest
}: IInputProps): JSX.Element {
  const handleWheel = (event: any) => {
    if (type === 'number') {
      event.target.blur();
    }
  };

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <RizInput
          type={type}
          label={
            <span className="mb-1 font-semibold">
              <span>{capitalize(label || name)}</span>
              <span className="font-bold text-red-600">
                {required && ' *'} <ErrorMessage name={name} />
              </span>
            </span>
          }
          className={`max-w-screen-xs ${className}`}
          placeholder={placeholder || capitalize(name)}
          onWheel={handleWheel}
          {...field}
          {...rest}
        />
      )}
    </Field>
  );
}
