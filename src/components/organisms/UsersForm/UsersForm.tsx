import './UsersForm.styles.css';
import { InputCheckbox, InputText } from '../../molecules';
import { type SubmitEventHandler, useState } from 'react';
import { Button } from '../../atoms';
import { ErrorMessage } from '../../atoms/ErrorMessage';

export type CreateUserFormValues = {
  name: string;
  phone: string;
  email: string;
  password: string;
  is_admin: string;
};

type UsersFormProps = {
  values: CreateUserFormValues;
  error?: string | null;
  loading: boolean;
  mode?: 'create' | 'edit';
  onCancelEdit?: () => void;
  onInputChange: (name: keyof CreateUserFormValues, value: string | boolean) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

export function UsersForm({
  values,
  error,
  loading,
  mode = 'create',
  onCancelEdit,
  onSubmit,
  onInputChange,
}: UsersFormProps) {
  const isEditing = mode === 'edit';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={'users-form'} onSubmit={onSubmit}>
      <InputText
        id={'name'}
        label={'Nombre'}
        type={'text'}
        hasIcon={false}
        required={true}
        value={values.name}
        onChange={(e) => onInputChange(e.target.name as keyof CreateUserFormValues, e.target.value)}
        disabled={loading}
        maxLength={40}
      />

      <InputText
        id={'phone'}
        label={'Teléfono'}
        type={'text'}
        hasIcon={false}
        required={true}
        value={values.phone}
        onChange={(e) => onInputChange(e.target.name as keyof CreateUserFormValues, e.target.value)}
        disabled={loading}
        maxLength={20}
      />

      <InputText
        id={'email'}
        label={'Correo electrónico'}
        type={'email'}
        required={true}
        value={values.email}
        onChange={(e) => onInputChange(e.target.name as keyof CreateUserFormValues, e.target.value)}
        disabled={loading}
      />

      <InputText
        id={'password'}
        label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
        type={'password'}
        shouldShow={showPassword}
        required={!isEditing}
        placeholder={isEditing ? 'Solo escribe para cambiarla' : undefined}
        value={values.password}
        onChange={(e) => onInputChange(e.target.name as keyof CreateUserFormValues, e.target.value)}
        disabled={loading}
        onPressShowPassword={() => setShowPassword((prev) => !prev)}
      />

      <InputCheckbox
        id={'is_admin'}
        label={'Administrador'}
        checked={values.is_admin === 'true'}
        disabled={loading}
        onChange={(e) => onInputChange(e.target.name as keyof CreateUserFormValues, e.target.checked.toString())}
      />

      {error && <ErrorMessage error={`Error: ${error}`} />}

      <div className={'users-form__actions'}>
        <Button type={'submit'} disabled={loading}>
          <span className={'button-text'}>
            {loading
              ? isEditing
                ? 'Guardando'
                : 'Creando'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear usuario'}
          </span>
        </Button>

        {isEditing && (
          <Button
            type={'button'}
            className={'users-form__cancel-button'}
            onClick={onCancelEdit}
            disabled={loading}
          >
            <span className={'button-text'}>Cancelar</span>
          </Button>
        )}
      </div>
    </form>
  );
}
