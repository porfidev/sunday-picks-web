/**
 * Created by porfidev on 26/02/26
 */

import './CreateTeamForm.styles.css';
import type { SubmitEventHandler } from 'react';
import { InputText, LogoUploader } from '../../molecules';
import { Button } from '../../atoms';
import { ErrorMessage } from '../../atoms/ErrorMessage';

export type CreateTeamFormValues = {
  name: string;
  logo: File | null;
};

type CreateTeamFormProps = {
  currentLogoUrl?: string | null;
  error?: string | null;
  loading: boolean;
  mode?: 'create' | 'edit';
  onCancelEdit?: () => void;
  onInputChange: (name: keyof CreateTeamFormValues, value: string | File | null) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  values: CreateTeamFormValues;
};

export function CreateTeamForm({
  currentLogoUrl,
  error,
  loading,
  mode = 'create',
  onCancelEdit,
  onInputChange,
  onSubmit,
  values,
}: CreateTeamFormProps) {
  const isEditing = mode === 'edit';

  return (
    <form className={'create-team-form'} onSubmit={onSubmit}>
      <InputText
        id={'name'}
        label={'Nombre del equipo'}
        type={'text'}
        hasIcon={false}
        required={true}
        value={values.name}
        onChange={(e) => onInputChange(e.target.name as keyof CreateTeamFormValues, e.target.value)}
        disabled={loading}
        maxLength={30}
      />
      <LogoUploader
        initialPreviewUrl={currentLogoUrl}
        onSelectFile={(file) => onInputChange('logo', file)}
        disabled={loading}
      />

      {error && <ErrorMessage error={`Error: ${error}`} />}
      <div className={'create-team-form__actions'}>
        <Button type={'submit'} disabled={loading}>
          <span className={'create-team-form__button-text'}>
            {loading
              ? isEditing
                ? 'Guardando'
                : 'Creando'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear equipo'}
          </span>
        </Button>
        {isEditing && (
          <Button
            type={'button'}
            className={'create-team-form__cancel-button'}
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
