import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import './InputText.styles.css';
import { InputIcon, Label } from '../../atoms';
import { InputField } from '../../atoms/InputField/InputField.tsx';

type BaseProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  id: string;
};

type PasswordProps = BaseProps & {
  type: 'password';
  onPressShowPassword?: () => void;
  shouldShow?: boolean;
};

type NonPasswordProps = BaseProps & {
  type: 'text' | 'email';
  shouldShow?: never;
  onPressShowPassword?: never;
};

type InputTextProps = PasswordProps | NonPasswordProps;

export function InputText({
  label,
  required,
  id,
  name,
  type,
  onPressShowPassword,
  placeholder,
  shouldShow,
  maxLength = 40,
  ...props
}: InputTextProps) {
  const handleType = (innerType?: HTMLInputTypeAttribute, innerShow?: boolean) => {
    if (!innerType) {
      return 'text';
    }
    if (innerType === 'password') {
      if (innerShow) {
        return 'text';
      }
      return 'password';
    }
    return innerType;
  };

  return (
    <div className={`input-text input-text-${type}`}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className={'input-text__group'}>
        <div className={'input-text__icon-wrapper'}>
          <InputIcon type={type} />
        </div>
        <InputField
          id={id}
          required={required}
          type={handleType(type, shouldShow)}
          placeholder={placeholder}
          name={name || id}
          maxLength={maxLength}
          {...props}
        />
        {type === 'password' && (
          <button className={'input-text__toggle'} onClick={onPressShowPassword}>
            {shouldShow ? <InputIcon type={'eye'} /> : <InputIcon type={'eye-closed'} />}
          </button>
        )}
      </div>
    </div>
  );
}
