/**
 * Created by porfidev on 16/02/26
 */

import './InputField.styles.css';
import type { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  required?: boolean;
  type: string;
  hasIcon?: boolean;
};

export function InputField({ id, required, type, hasIcon = true, ...props }: InputFieldProps) {
  return (
    <input
      id={id}
      required={required}
      type={type}
      className={`input-field ${!hasIcon ? 'input-field--no-icon' : ''}`.trim()}
      {...props}
    />
  );
}
