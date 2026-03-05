import './GamesForm.styles.css';
import type { SubmitEventHandler } from 'react';
import { Button, Icon, Label } from '../../atoms';
import type { GetSeasonResponse } from '../../../features/seasons/types.ts';
import type { GetWeekResponse } from '../../../features/weeks/types.ts';
import type { GetTeamsResponse } from '../../../features/teams/types.ts';
import { ErrorMessage } from '../../atoms/ErrorMessage';
import DatePicker from 'react-datepicker';
import { format, isValid, parse } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

export type CreateGameValues = {
  season_id: string;
  week_id: string;
  local_team_id: string;
  visit_team_id: string;
  game_datetime: string;
};

type GamesFormProps = {
  values: CreateGameValues;
  seasons: GetSeasonResponse[];
  weeks: GetWeekResponse[];
  teams: GetTeamsResponse[];
  error?: string | null;
  loading: boolean;
  loadingCatalogs?: boolean;
  onInputChange: (name: keyof CreateGameValues, value: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

type OptionFieldProps = {
  id: keyof CreateGameValues;
  label: string;
  value: string;
  disabled?: boolean;
  placeholder: string;
  options: Array<{ id: string; label: string }>;
  onInputChange: (name: keyof CreateGameValues, value: string) => void;
};

function OptionField({
  id,
  label,
  value,
  disabled,
  placeholder,
  options,
  onInputChange,
}: OptionFieldProps) {
  return (
    <div className={'games-form__field'}>
      <Label htmlFor={id} required={true}>
        {label}
      </Label>
      <select
        id={id}
        name={id}
        className={'games-form__select'}
        value={value}
        required={true}
        disabled={disabled}
        onChange={(e) => onInputChange(e.target.name as keyof CreateGameValues, e.target.value)}
      >
        <option value={''}>{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function parseGameDatetime(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withSeconds = parse(trimmed, 'yyyy-MM-dd HH:mm:ss', new Date());
  if (isValid(withSeconds)) {
    return withSeconds;
  }

  const withoutSeconds = parse(trimmed, 'yyyy-MM-dd HH:mm', new Date());
  if (isValid(withoutSeconds)) {
    return withoutSeconds;
  }

  return null;
}

export function GamesForm({
  values,
  seasons,
  weeks,
  teams,
  error,
  loading,
  loadingCatalogs = false,
  onInputChange,
  onSubmit,
}: GamesFormProps) {
  const isDisabled = loading || loadingCatalogs;
  const selectedGameDatetime = parseGameDatetime(values.game_datetime);

  return (
    <form className={'games-form'} onSubmit={onSubmit}>
      <input type={'hidden'} id={'is_played'} name={'is_played'} value={'0'} />
      <div className={'games-form__grid'}>
        <OptionField
          id={'season_id'}
          label={'Temporada'}
          value={values.season_id}
          disabled={isDisabled}
          placeholder={'Selecciona temporada'}
          options={seasons.map((season) => ({ id: season.id, label: season.name }))}
          onInputChange={onInputChange}
        />

        <OptionField
          id={'week_id'}
          label={'Semana'}
          value={values.week_id}
          disabled={isDisabled}
          placeholder={'Selecciona semana'}
          options={weeks.map((week) => ({ id: week.id, label: week.name }))}
          onInputChange={onInputChange}
        />

        <div className={'games-form__field'}>
          <Label htmlFor={'game_datetime'} required={true}>
            Fecha y hora
          </Label>
          <DatePicker
            id={'game_datetime'}
            selected={selectedGameDatetime}
            onChange={(date: Date | null) => {
              if (date instanceof Date) {
                onInputChange('game_datetime', format(date, 'yyyy-MM-dd HH:mm:ss'));
                return;
              }

              onInputChange('game_datetime', '');
            }}
            showTimeSelect={true}
            timeIntervals={5}
            timeFormat={'HH:mm'}
            dateFormat={'yyyy-MM-dd HH:mm:ss'}
            placeholderText={'aaaa-mm-dd HH:mm:ss'}
            className={'games-form__datepicker'}
            wrapperClassName={'games-form__datepicker-wrapper'}
            calendarClassName={'games-form__calendar'}
            popperClassName={'games-form__popper'}
            required={true}
            disabled={isDisabled}
            autoComplete={'off'}
          />
        </div>

        <OptionField
          id={'local_team_id'}
          label={'Equipo local'}
          value={values.local_team_id}
          disabled={isDisabled}
          placeholder={'Selecciona equipo local'}
          options={teams.map((team) => ({ id: team.id, label: team.name }))}
          onInputChange={onInputChange}
        />

        <OptionField
          id={'visit_team_id'}
          label={'Equipo visitante'}
          value={values.visit_team_id}
          disabled={isDisabled}
          placeholder={'Selecciona equipo visitante'}
          options={teams.map((team) => ({ id: team.id, label: team.name }))}
          onInputChange={onInputChange}
        />

        <div className={'games-form__submit-wrapper'}>
          <Button type={'submit'} className={'games-form__submit'} disabled={isDisabled}>
            <span className={'games-form__submit-content'}>
              <Icon name={'save'} size={20} />
              <span className={'button-text'}>{loading ? 'Guardando' : 'Guardar partido'}</span>
            </span>
          </Button>
        </div>
      </div>

      {error && <ErrorMessage error={`Error: ${error}`} />}
    </form>
  );
}
