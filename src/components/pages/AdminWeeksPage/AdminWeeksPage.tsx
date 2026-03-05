/**
 * Created by porfidev on 02/03/26
 */

import './AdminWeeksPage.styles.css';
import { MainTemplate } from '../../templates';
import { SectionTitle } from '../../atoms/SectionTitle';
import { LineSpacer } from '../../atoms/LineSpacer';
import { Card, Icon } from '../../atoms';
import { CardTitle } from '../../atoms/CardTitle';
import { type CreateWeekValues, WeeksForm } from '../../organisms/WeeksForm';
import { useCreateWeek } from '../../../features/weeks/hooks/useCreateWeek.ts';
import { type SubmitEventHandler, useRef, useState } from 'react';
import { useWeeks } from '../../../features/weeks/hooks/useWeeks.ts';
import { ActiveWeeksPanel } from '../../organisms/ActiveWeeksPanel';
import type { GetWeekResponse } from '../../../features/weeks/types.ts';

export function AdminWeeksPage() {
  const { values, loading, submit, upload, setValues, error } = useCreateWeek();
  const { weeks, loading: loadingWeeks, deletingId, error: weeksError, deleteWeek, refetch } = useWeeks();
  const [formKey, setFormKey] = useState(0);
  const [editingWeekId, setEditingWeekId] = useState<string | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  const setInputValue = (name: keyof CreateWeekValues, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const weekResult = editingWeekId ? await upload(editingWeekId) : await submit();

    if (weekResult?.data) {
      setValues({
        name: '',
      });
      setEditingWeekId(null);
      setFormKey((prev) => prev + 1);
      await refetch();
    }
  };

  const onEditWeek = (week: GetWeekResponse) => {
    setEditingWeekId(week.id);
    setValues({
      name: week.name,
    });
    setFormKey((prev) => prev + 1);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCancelEdit = () => {
    setEditingWeekId(null);
    setValues({
      name: '',
    });
    setFormKey((prev) => prev + 1);
  };

  const onDeleteWeek = async (week: GetWeekResponse) => {
    const accepted = window.confirm(`¿Deseas eliminar la semana "${week.name}"?`);

    if (!accepted) {
      return;
    }

    const deleted = await deleteWeek(week.id);
    if (deleted && editingWeekId === week.id) {
      onCancelEdit();
    }
  };

  return (
    <MainTemplate>
      <div className={'admin-weeks-page'} ref={formCardRef}>
        <SectionTitle>Registro de Semanas</SectionTitle>
        <LineSpacer />

        <Card className={'admin-weeks-page__card'} classNameInner={'admin-weeks-page__card-inner'}>
          <CardTitle
            icon={<Icon name={'add_circle'} color={'rgb(242, 13, 13)'} size={24} />}
            iconPosition="left"
          >
            {editingWeekId ? 'Editar semana' : 'Alta de semanas'}
          </CardTitle>

          <WeeksForm
            key={formKey}
            values={values}
            loading={loading}
            mode={editingWeekId ? 'edit' : 'create'}
            onCancelEdit={onCancelEdit}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
            error={error}
          />
        </Card>

        <div className={'admin-weeks-page__weeks-list'}>
          <ActiveWeeksPanel
            weeks={weeks}
            loading={loadingWeeks}
            deletingId={deletingId}
            error={weeksError}
            onEditWeek={onEditWeek}
            onDeleteWeek={onDeleteWeek}
          />
        </div>
      </div>
    </MainTemplate>
  );
}
