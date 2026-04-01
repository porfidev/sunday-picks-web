/**
 * Created by porfidev on 01/04/26
 */

import './InputSelect.styles.css';
import { Label } from '../../atoms';
import type { SelectHTMLAttributes } from 'react';
import { OptionField } from '../../atoms/OptionField';

type InputSelectProps<T> = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  id: string;
  placeholder?: string;
  value: T;
  options: {
    key: string;
    value: T;
    label: string;
  }[];
};

export function InputSelect<T>({
  label,
  id,
  required,
  placeholder,
  options,
  value,
  ...props
}: InputSelectProps<T>) {
  return (
    <div className={'input-select'}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <OptionField<T>
        value={value}
        options={options}
        placeholder={placeholder}
        id={id}
        name={id}
        required={required}
        {...props}
      />
    </div>
  );
}
