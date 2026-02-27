import { MainTemplate } from '../../templates';
import { Card, Icon } from '../../atoms';
import { SectionTitle } from '../../atoms/SectionTitle';
import { LineSpacer } from '../../atoms/LineSpacer';
import { CardTitle } from '../../atoms/CardTitle';
import './AdminTeamsPage.styles.css';
import { CreateTeamForm, type CreateTeamFormValues } from '../../organisms/CreateTeamForm';
import { useCreateTeam } from '../../../features/teams/hooks/useCreateTeam.ts';
import { useState, type SubmitEventHandler } from 'react';
import { ActiveTeamsPanel } from '../../organisms/ActiveTeamsPanel';
import { useTeams } from '../../../features/teams/hooks/useTeams.ts';

export function AdminTeamsPage() {
  const { values, loading, submit, error, setValues } = useCreateTeam();
  const { teams, loading: loadingTeams, error: teamsError, refetch } = useTeams();
  const [formKey, setFormKey] = useState(0);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const createTeamResult = await submit();

    if (createTeamResult?.data) {
      setValues({
        name: '',
        logo: null,
      });
      setFormKey((prev) => prev + 1);
      await refetch();
    }
  };

  const setInputValue = (name: keyof CreateTeamFormValues, value: string | File | null) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
  };

  return (
    <MainTemplate>
      <div className={'admin-teams-page'}>
        <SectionTitle>Registro de Equipos</SectionTitle>
        <LineSpacer />

        <Card className={'admin-teams-page__card'} classNameInner={'admin-teams-page__card-inner'}>
          <CardTitle
            icon={<Icon name={'add_circle'} color={'rgb(242, 13, 13)'} size={24} />}
            iconPosition="left"
          >
            registra un nuevo equipo
          </CardTitle>

          <CreateTeamForm
            key={formKey}
            error={error}
            loading={loading}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
            values={values}
          />
        </Card>

        <div className={'admin-teams-page__teams-list'}>
          <ActiveTeamsPanel teams={teams} loading={loadingTeams} error={teamsError} />
        </div>
      </div>
    </MainTemplate>
  );
}
