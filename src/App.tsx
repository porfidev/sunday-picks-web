import { Navigate, Route, Routes } from 'react-router-dom';
import {
  AdminSeasonsPage,
  AdminTeamsPage,
  AdminSettingsPage,
  AdminUsersPage,
  AdminRoute,
  HomePage,
  LoginPage,
  ProtectedRoute,
  AdminGamesPage,
  AdminGameResultsPage,
} from './components';
import { AdminWeeksPage } from './components/pages/AdminWeeksPage';

function App() {
  return (
    <div className={'page'}>
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="teams" element={<AdminTeamsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="weeks" element={<AdminWeeksPage />} />
              <Route path="seasons" element={<AdminSeasonsPage />} />
              <Route path="games" element={<AdminGamesPage />} />
              <Route path="game-results" element={<AdminGameResultsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
