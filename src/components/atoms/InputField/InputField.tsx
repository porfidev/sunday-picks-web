/**
 * Created by porfidev on 16/02/26
 */

import './InputField.styles.css';
import type { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  required?: boolean;
  type: string;
};

export function InputField({ id, required, type, ...props }: InputFieldProps) {
  return <input id={id} required={required} type={type} className={'input-field'} {...props} />;
}
