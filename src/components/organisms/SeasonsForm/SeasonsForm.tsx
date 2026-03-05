import './SeasonsForm.styles.css';
import { InputText } from '../../molecules';
import { ErrorMessage } from '../../atoms/ErrorMessage';
import type { SubmitEventHandler } from 'react';
import { Button } from '../../atoms';

export type CreateSeasonValues = {
  name: string;
};

type SeasonsFormProps = {
  values: CreateSeasonValues;
  error?: string | null;
  loading: boolean;
  mode?: 'create' | 'edit';
  onCancelEdit?: () => void;
  onInputChange: (name: keyof CreateSeasonValues, value: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

export function SeasonsForm({
  values,
  error,
  loading,
  mode = 'create',
  onCancelEdit,
  onSubmit,
  onInputChange,
}: SeasonsFormProps) {
  const isEditing = mode === 'edit';

  return (
    <form className={'seasons-form'} onSubmit={onSubmit}>
      <InputText
        id={'name'}
        label={'Nombre de la temporada'}
        type={'text'}
        hasIcon={false}
        required={true}
        value={values.name}
        onChange={(e) => onInputChange(e.target.name as keyof CreateSeasonValues, e.target.value)}
        disabled={loading}
        maxLength={30}
      />
      {error && <ErrorMessage error={`Error: ${error}`} />}

      <div className={'seasons-form__actions'}>
        <Button type={'submit'} disabled={loading}>
          <span className={'button-text'}>
            {loading
              ? isEditing
                ? 'Guardando'
                : 'Creando'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear temporada'}
          </span>
        </Button>
        {isEditing && (
          <Button
            type={'button'}
            className={'seasons-form__cancel-button'}
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
