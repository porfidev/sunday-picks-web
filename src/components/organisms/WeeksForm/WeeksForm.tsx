/**
 * Created by porfidev on 02/03/26
 */

import './WeeksForm.styles.css';
import { InputText } from '../../molecules';
import { ErrorMessage } from '../../atoms/ErrorMessage';
import type { SubmitEventHandler } from 'react';
import { Button } from '../../atoms';

export type CreateWeekValues = {
  name: string;
};

type WeeksFormProps = {
  values: CreateWeekValues;
  error?: string | null;
  loading: boolean;
  mode?: 'create' | 'edit';
  onCancelEdit?: () => void;
  onInputChange: (name: keyof CreateWeekValues, value: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

export function WeeksForm({
  values,
  error,
  loading,
  mode = 'create',
  onCancelEdit,
  onSubmit,
  onInputChange,
}: WeeksFormProps) {
  const isEditing = mode === 'edit';

  return (
    <form className={'weeks-form'} onSubmit={onSubmit}>
      <InputText
        id={'name'}
        label={'Nombre de la semana'}
        type={'text'}
        hasIcon={false}
        required={true}
        value={values.name}
        onChange={(e) => onInputChange(e.target.name as keyof CreateWeekValues, e.target.value)}
        disabled={loading}
        maxLength={30}
      />
      {error && <ErrorMessage error={`Error: ${error}`} />}

      <div className={'weeks-form__actions'}>
        <Button type={'submit'} disabled={loading}>
          <span className={'button-text'}>
            {loading
              ? isEditing
                ? 'Guardando'
                : 'Creando'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear semana'}
          </span>
        </Button>
        {isEditing && (
          <Button
            type={'button'}
            className={'weeks-form__cancel-button'}
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
