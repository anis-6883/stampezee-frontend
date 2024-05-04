'use strict';

import { ErrorMessage, Field, FieldProps } from 'formik';
import { capitalize } from 'lodash';
import { CheckboxProps, Checkbox as RizCheckBox } from 'rizzui';

interface CheckBoxProps extends CheckboxProps {
  name: string;
  label: string;
  className?: string;
  required?: boolean;
  labelPlacement?: 'left' | 'right';
  disabled?: boolean;
}

/**
 * CheckBox component for use in React applications, built on top of Rizzui CheckBox.
 *
 * @component CheckBox
 *
 * @param {string} name - The name of the checkbox, used as the key for Formik state.
 * @param {string} label - The label text for the checkbox.
 * @param {string} [className=""] - Additional CSS class names for the checkbox.
 * @param {boolean} [required=true] - If true, indicates that the checkbox is required.
 * @param {"left" | "right"} [labelPlacement="right"] - The placement of the label relative to the checkbox.
 * @param {boolean} [disabled=false] - If true, disables the checkbox.
 * @param {...CheckboxProps} [rest] - Additional props for the underlying Rizzui CheckBox component.
 *
 * @example
 * // Basic usage
 * <CheckBox name="agree" label="I agree to the terms and conditions" />
 *
 * @example
 * // Checkbox with custom class and left-aligned label
 * <CheckBox name="subscribe" label="Subscribe to newsletter" className="custom-checkbox" labelPlacement="left" />
 *
 * @example
 * // Disabled checkbox with required label
 * <CheckBox name="disabledOption" label="I am disabled" disabled required />
 *
 * @returns {JSX.Element} - A React JSX element representing the checkbox.
 */
export default function CheckBox({
  name,
  label = '',
  required = true,
  className = '',
  labelPlacement = 'right',
  disabled = false,
  ...rest
}: CheckBoxProps) {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <RizCheckBox
          label={
            <span className="mb-1 font-semibold">
              <span>{capitalize(label)}</span>
              <span className="text-red-600">
                {required && '*'} <ErrorMessage name={name} />
              </span>
            </span>
          }
          labelPlacement="right"
          rounded="lg"
          className={`max-w-max ${className}`}
          disabled={disabled}
          {...field}
          {...rest}
        />
      )}
    </Field>
  );
}
