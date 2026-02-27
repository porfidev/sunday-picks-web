import { MainTemplate } from '../../templates';
import { Card, Icon } from '../../atoms';
import { SectionTitle } from '../../atoms/SectionTitle';
import { LineSpacer } from '../../atoms/LineSpacer';
import { CardTitle } from '../../atoms/CardTitle';
import './AdminTeamsPage.styles.css';
import { CreateTeamForm, type CreateTeamFormValues } from '../../organisms/CreateTeamForm';
import { useCreateTeam } from '../../../features/teams/hooks/useCreateTeam.ts';
import { useRef, useState, type SubmitEventHandler } from 'react';
import { ActiveTeamsPanel } from '../../organisms/ActiveTeamsPanel';
import { useTeams } from '../../../features/teams/hooks/useTeams.ts';
import type { GetTeamsResponse } from '../../../features/teams/types.ts';
import { getTeamLogoSrc } from '../../../features/teams/lib/teamLogo.ts';

export function AdminTeamsPage() {
  const { values, loading, submit, update, error, setValues } = useCreateTeam();
  const { teams, loading: loadingTeams, error: teamsError, refetch } = useTeams();
  const [formKey, setFormKey] = useState(0);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamLogoUrl, setEditingTeamLogoUrl] = useState<string | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const teamResult = editingTeamId ? await update(editingTeamId) : await submit();

    if (teamResult?.data) {
      setValues({
        name: '',
        logo: null,
      });
      setEditingTeamId(null);
      setEditingTeamLogoUrl(null);
      setFormKey((prev) => prev + 1);
      await refetch();
    }
  };

  const onEditTeam = (team: GetTeamsResponse) => {
    setEditingTeamId(team.id);
    setValues({
      name: team.name,
      logo: null,
    });
    setEditingTeamLogoUrl(getTeamLogoSrc(team.logo_uri));
    setFormKey((prev) => prev + 1);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCancelEdit = () => {
    setEditingTeamId(null);
    setEditingTeamLogoUrl(null);
    setValues({
      name: '',
      logo: null,
    });
    setFormKey((prev) => prev + 1);
  };

  const setInputValue = (name: keyof CreateTeamFormValues, value: string | File | null) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
  };

  return (
    <MainTemplate>
      <div className={'admin-teams-page'} ref={formCardRef}>
        <SectionTitle>Registro de Equipos</SectionTitle>
        <LineSpacer />

        <Card className={'admin-teams-page__card'} classNameInner={'admin-teams-page__card-inner'}>
          <CardTitle
            icon={<Icon name={'add_circle'} color={'rgb(242, 13, 13)'} size={24} />}
            iconPosition="left"
          >
            {editingTeamId ? 'editar equipo' : 'registra un nuevo equipo'}
          </CardTitle>

          <CreateTeamForm
            key={formKey}
            currentLogoUrl={editingTeamLogoUrl}
            error={error}
            loading={loading}
            mode={editingTeamId ? 'edit' : 'create'}
            onCancelEdit={onCancelEdit}
            onInputChange={setInputValue}
            onSubmit={onSubmit}
            values={values}
          />
        </Card>

        <div className={'admin-teams-page__teams-list'}>
          <ActiveTeamsPanel
            teams={teams}
            loading={loadingTeams}
            error={teamsError}
            onEditTeam={onEditTeam}
          />
        </div>
      </div>
    </MainTemplate>
  );
}
