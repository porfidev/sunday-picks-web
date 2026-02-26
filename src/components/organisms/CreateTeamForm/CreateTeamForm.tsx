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
  error?: string | null;
  loading: boolean;
  onInputChange: (name: keyof CreateTeamFormValues, value: string | File | null) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  values: CreateTeamFormValues;
};

export function CreateTeamForm({
  error,
  loading,
  onInputChange,
  onSubmit,
  values,
}: CreateTeamFormProps) {
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
      />
      <LogoUploader onSelectFile={(file) => onInputChange('logo', file)} disabled={loading} />

      {error && <ErrorMessage error={`Error: ${error}`} />}
      <Button type={'submit'} disabled={loading}>
        <span className={'button-text'}>{loading ? 'Creando' : 'Crear equipo'}</span>
      </Button>
    </form>
  );
}
