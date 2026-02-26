import { Link } from 'react-router-dom';
import { MainTemplate } from '../../templates';

export function HomePage() {
  return (
    <MainTemplate>
      <section style={{ width: '600px' }}>
        <Link to={'/admin/teams'}>Administrar Equipos</Link>
      </section>
    </MainTemplate>
  );
}
