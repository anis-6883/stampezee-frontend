'use client';

import { Field } from 'formik';
import { capitalize } from 'lodash';
import { Switch as RizSwitch } from 'rizzui';

interface SwitchProps {
  name: string;
  checked?: boolean;
  label?: string;
  lablePlacement?: 'left' | 'right';
  switchClassName?: string;
  switchKnobClassName?: string;
}

/**
 * Switch component for use in React applications, built on top of Rizzui Switch.
 *
 * @component Switch
 *
 * @param {string} name - The name of the switch, used as the key for Formik state.
 * @param {boolean} [checked=false] - If true, indicates that the switch is initially checked.
 * @param {string} [label=""] - The label text for the switch.
 * @param {"left" | "right"} [labelPlacement="left"] - The placement of the label relative to the switch.
 * @param {string} [switchClassName=""] - Additional CSS class names for the switch container.
 * @param {string} [switchKnobClassName=""] - Additional CSS class names for the switch knob.
 *
 * @example
 * // Basic usage
 * <Switch name="notifications" label="Enable Notifications" />
 *
 * @example
 * // Switch with right-aligned label and custom switch classes
 * <Switch name="darkMode" label="Dark Mode" labelPlacement="right" switchClassName="custom-switch" switchKnobClassName="custom-knob" />
 *
 * @example
 * // Checked switch with default label placement
 * <Switch name="receiveUpdates" checked={true condition} label="Receive Updates" />
 *
 * @returns {JSX.Element} - A React JSX element representing the switch.
 */
export default function Switch({
  name,
  checked = false,
  label,
  lablePlacement = 'left',
  switchClassName,
  switchKnobClassName,
}: SwitchProps): JSX.Element {
  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => (
        <RizSwitch
          defaultChecked={checked}
          label={label || capitalize(label)}
          switchClassName={`bg-slate-50 border border-[#c4d9fc] ${switchClassName}`}
          switchKnobClassName={`bg-primary ${switchKnobClassName}`}
          labelPlacement={lablePlacement}
          {...field}
        />
      )}
    </Field>
  );
}
