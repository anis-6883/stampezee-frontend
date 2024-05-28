import { Field } from 'formik';
import React, { useState } from 'react';
import { LuUnlock } from 'react-icons/lu';
import { Password } from 'rizzui';

interface PasswordFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ name, label, placeholder = '**********' }) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [containsUppercase, setContainsUppercase] = useState(false);
  const [containsLowercase, setContainsLowercase] = useState(false);
  const [containsDigit, setContainsDigit] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);

  const checkPasswordStrength = (password: string) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;

    const containsUppercase = uppercaseRegex.test(password);
    const containsLowercase = lowercaseRegex.test(password);
    const containsDigit = digitRegex.test(password);
    const isLengthValid = password.length >= 6;

    let strength = '';
    if (containsUppercase && containsLowercase && containsDigit && isLengthValid) {
      strength = 'Strong';
    } else {
      strength = 'Weak';
    }

    setContainsUppercase(containsUppercase);
    setContainsLowercase(containsLowercase);
    setContainsDigit(containsDigit);
    setIsLengthValid(isLengthValid);
    setStrength(strength);
  };

  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => (
        <div className="">
          {/* <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
          </label> */}
          <div className="mt-1">
            <Password
              size="md"
              label={
                label ? (
                  <p className="flex items-center gap-x-2">
                    <LuUnlock className="text-base" /> {label}
                    <span className="font-bold text-red-600"> *</span>
                  </p>
                ) : (
                  ''
                )
              }
              variant="flat"
              color="primary"
              labelClassName="text-base"
              autoComplete="off"
              className="bg-gray-100"
              placeholder={placeholder}
              {...field}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(e);
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <p className={`text-xs ${containsUppercase ? 'text-green-600' : 'text-red-600'}`}>At least one uppercase letter.</p>
            <p className={`text-xs ${containsLowercase ? 'text-green-600' : 'text-red-600'}`}>At least one lowercase letter.</p>
            <p className={`text-xs ${containsDigit ? 'text-green-600' : 'text-red-600'}`}>At least one digit.</p>
            <p className={`text-xs ${isLengthValid ? 'text-green-600' : 'text-red-600'}`}>Password must be at least 6 characters long.</p>
          </div>
        </div>
      )}
    </Field>
  );
};

export default PasswordField;
