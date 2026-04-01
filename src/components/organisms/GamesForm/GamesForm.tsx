import './GamesForm.styles.css';
import type { ChangeEvent, SubmitEventHandler } from 'react';
import { Button, Label } from '../../atoms';
import type { GetSeasonResponse } from '../../../features/seasons/types.ts';
import type { GetWeekResponse } from '../../../features/weeks/types.ts';
import type { GetTeamsResponse } from '../../../features/teams/types.ts';
import { ErrorMessage } from '../../atoms/ErrorMessage';
import DatePicker from 'react-datepicker';
import { format, isValid, parse } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { InputSelect } from '../../molecules/InputSelect';

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
  onInputChange: (value: { name: keyof CreateGameValues; value: string }) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

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

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onInputChange) {
      onInputChange({
        name: event.target.id as keyof CreateGameValues,
        value: String(event.target.value),
      });
    }
  };
  return (
    <form className={'games-form'} onSubmit={onSubmit}>
      <input type={'hidden'} id={'is_played'} name={'is_played'} value={'0'} />
      <div className={'games-form__grid'}>
        <InputSelect<string>
          id={'season_id'}
          label={'Temporada'}
          value={values.season_id}
          disabled={isDisabled}
          placeholder={'Selecciona una temporada'}
          options={seasons.map((season) => ({
            key: season.id,
            value: season.id,
            label: season.name,
          }))}
          onChange={handleSelect}
          required={true}
        />

        <InputSelect<string>
          id={'week_id'}
          label={'Semana'}
          value={values.week_id}
          disabled={isDisabled}
          placeholder={'Selecciona una semana'}
          options={weeks.map((week) => ({ key: week.id, value: week.id, label: week.name }))}
          onChange={handleSelect}
          required={true}
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
                onInputChange({
                  name: 'game_datetime',
                  value: format(date, 'yyyy-MM-dd HH:mm:ss'),
                });
                return;
              }

              onInputChange({ name: 'game_datetime', value: '' });
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
            minDate={new Date()}
          />
        </div>

        <InputSelect
          id={'local_team_id'}
          label={'Equipo local'}
          value={values.local_team_id}
          disabled={isDisabled}
          placeholder={'Selecciona un equipo local'}
          options={teams.map((team) => ({ key: team.id, value: team.id, label: team.name }))}
          onChange={handleSelect}
          required={true}
        />

        <InputSelect
          id={'visit_team_id'}
          label={'Equipo visitante'}
          value={values.visit_team_id}
          disabled={isDisabled}
          placeholder={'Selecciona un equipo visitante'}
          options={teams.map((team) => ({ key: team.id, value: team.id, label: team.name }))}
          onChange={handleSelect}
          required={true}
        />

        <div className={'games-form__submit-wrapper'}>
          <Button type={'submit'} disabled={isDisabled}>
            <span className={'games-form__button-text'}>
              <span className={'button-text'}>{loading ? 'Guardando' : 'Guardar partido'}</span>
            </span>
          </Button>
        </div>
      </div>

      {error && <ErrorMessage error={`Error: ${error}`} />}
    </form>
  );
}
