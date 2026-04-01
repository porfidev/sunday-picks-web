/**
 * Created by porfidev on 01/04/26
 */

import './OptionField.styles.css';
import type { SelectHTMLAttributes } from 'react';

type OptionFieldProps<T> = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  required?: boolean;
  placeholder?: string;
  value: T;
  options: {
    key: string;
    value: T;
    label: string;
  }[];
};

export function OptionField<T>({
  id,
  required,
  placeholder = 'seleccione una opción',
  options,
  ...props
}: OptionFieldProps<T>) {
  return (
    <select id={id} name={id} className={'option-field'} required={required} {...props}>
      <option value={''}>{placeholder}</option>
      {options.map((option) => (
        <option key={option.key} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
