/**
 * Created by porfidev on 04/03/26
 */

import './AdminSeasonsPage.styles.css';
import { MainTemplate } from '../../templates';
import { SectionTitle } from '../../atoms/SectionTitle';
import { LineSpacer } from '../../atoms/LineSpacer';
import { Card, Icon } from '../../atoms';
import { CardTitle } from '../../atoms/CardTitle';
import { type CreateSeasonValues, SeasonsForm } from '../../organisms/SeasonsForm';
import { useCreateSeason } from '../../../features/seasons/hooks/useCreateSeason.ts';
import { type SubmitEventHandler, useRef, useState } from 'react';
import { useSeasons } from '../../../features/seasons/hooks/useSeasons.ts';
import { ActiveSeasonsPanel } from '../../organisms/ActiveSeasonsPanel';
import type { GetSeasonResponse } from '../../../features/seasons/types.ts';

export function AdminSeasonsPage() {
  const { values, loading, submit, upload, setValues, error } = useCreateSeason();
  const {
    seasons,
    loading: loadingSeasons,
    deletingId,
    error: seasonsError,
    deleteSeason,
    refetch,
  } = useSeasons();
  const [formKey, setFormKey] = useState(0);
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  const setInputValue = (name: keyof CreateSeasonValues, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const seasonResult = editingSeasonId ? await upload(editingSeasonId) : await submit();

    if (seasonResult?.data) {
      setValues({
        name: '',
      });
      setEditingSeasonId(null);
      setFormKey((prev) => prev + 1);
      await refetch();
    }
  };

  const onEditSeason = (season: GetSeasonResponse) => {
    setEditingSeasonId(season.id);
    setValues({
      name: season.name,
    });
    setFormKey((prev) => prev + 1);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCancelEdit = () => {
    setEditingSeasonId(null);
    setValues({
      name: '',
    });
    setFormKey((prev) => prev + 1);
  };

  const onDeleteSeason = async (season: GetSeasonResponse) => {
    const accepted = window.confirm(`¿Deseas eliminar la temporada "${season.name}"?`);

    if (!accepted) {
      return;
    }

    const deleted = await deleteSeason(season.id);
    if (deleted && editingSeasonId === season.id) {
      onCancelEdit();
    }
  };

  return (
    <MainTemplate>
      <div className={'admin-seasons-page'} ref={formCardRef}>
        <SectionTitle>Registro de Temporadas</SectionTitle>
        <LineSpacer />

        <Card
          className={'admin-seasons-page__card'}
          classNameInner={'admin-seasons-page__card-inner'}
        >
          <CardTitle
            icon={<Icon name={'add_circle'} color={'rgb(242, 13, 13)'} size={24} />}
            iconPosition="left"
          >
            {editingSeasonId ? 'Editar temporada' : 'Alta de temporadas'}
          </CardTitle>

          <SeasonsForm
            key={formKey}
            values={values}
            loading={loading}
            mode={editingSeasonId ? 'edit' : 'create'}
            onCancelEdit={onCancelEdit}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
            error={error}
          />
        </Card>

        <div className={'admin-seasons-page__seasons-list'}>
          <ActiveSeasonsPanel
            seasons={seasons}
            loading={loadingSeasons}
            deletingId={deletingId}
            error={seasonsError}
            onEditSeason={onEditSeason}
            onDeleteSeason={onDeleteSeason}
          />
        </div>
      </div>
    </MainTemplate>
  );
}
