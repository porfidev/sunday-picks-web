import type { InputHTMLAttributes } from 'react';
import './InputCheckbox.css';
import { Label } from '../../atoms/Label/Label.tsx';

type InputCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  id: string;
};

export function InputCheckbox({ label, id, required, ...props }: InputCheckboxProps) {
  return (
    <div className={'input-checkbox'}>
      <input id={id} type={'checkbox'} className={'input-checkbox__checkbox'} {...props} />
      <Label htmlFor={id} required={required} variant={'checkbox'}>
        {label}
      </Label>
    </div>
  );
}
