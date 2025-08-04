import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import CommisionAffectation from './pages/commisionaffectation';
import Services from './pages/services';
import Directions from './pages/directions';
import TableauBord from './pages/tableaubord';
import Users from './pages/Users';
import CreateUser from './pages/Users/create';
import Ecole from './pages/Ecole';
import Eleve from './pages/Eleve';
import A1 from './pages/A1';
import C1 from './pages/C1';
import C3 from './pages/C3';
import RapportActivitePage from './pages/RapportActivite';
import CreateRapportActivite from './pages/RapportActivite/create';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Routes publiques (sans layout) */}
      <Route
        index
        element={
          <>
            <PageTitle title="Connexion | Ministère de l'EDU-NC" />
            <SignIn />
          </>
        }
      />
      <Route
        path='/signin'
        element={
          <>
            <PageTitle title="Connexion | Ministère de l'EDU-NC" />
            <SignIn />
          </>
        }
      />
      <Route
        path='/signup'
        element={
          <>
            <PageTitle title="Inscription | Ministère de l'EDU-NC" />
            <SignUp />
          </>
        }
      />

      {/* Routes protégées (avec layout) */}
      <Route
        path="/*"
        element={
          <DefaultLayout>
            <Routes>
              <Route
                path='/eleve'
                element={
                  <>
                    <PageTitle title="Élève | Ministère de l'EDU-NC" />
                    <Eleve />
                  </>
                }
              />
              <Route
                path='/fomulaires/a1'
                element={
                  <>
                    <PageTitle title="A1 | Ministère de l'EDU-NC" />
                    <A1 />
                  </>
                }
              />
              <Route
                path='/fomulaires/c1'
                element={
                  <>
                    <PageTitle title="C1 | Ministère de l'EDU-NC" />
                    <C1 />
                  </>
                }
              />
              <Route
                path='/fomulaires/c3'
                element={
                  <>
                    <PageTitle title="C3 | Ministère de l'EDU-NC" />
                    <C3 />
                  </>
                }
              />
              <Route
                path='/ecole'
                element={
                  <>
                    <PageTitle title="Ecole | Ministère de l'EDU-NC" />
                    <Ecole />
                  </>
                }
              />
              <Route
                path='/users'
                element={
                  <>
                    <PageTitle title="Utilisateurs | Ministère de l'EDU-NC" />
                    <Users />
                  </>
                }
              />
              <Route
                path='/users/create'
                element={
                  <>
                    <PageTitle title="Créer un utilisateur | Ministère de l'EDU-NC" />
                    <CreateUser />
                  </>
                }
              />
              <Route
                path="/tableaubord"
                element={
                  <>
                    <PageTitle title="Tableau de bord | Ministère de l'EDU-NC" />
                    <TableauBord />
                  </>
                }
              />
              <Route
                path="/affectation"
                element={
                  <>
                    <PageTitle title="Commission d'affectation | Ministère de l'EDU-NC" />
                    <CommisionAffectation />
                  </>
                }
              />
              <Route
                path="/services"
                element={
                  <>
                    <PageTitle title="Services | Ministère de l'EDU-NC" />
                    <Services />
                  </>
                }
              />
              <Route
                path="/directions"
                element={
                  <>
                    <PageTitle title="Directions | Ministère de l'EDU-NC" />
                    <Directions />
                  </>
                }
              />
              <Route
                path="/calendar"
                element={
                  <>
                    <PageTitle title="Rendez-vous | Ministère de l'EDU-NC" />
                    <Calendar />
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <PageTitle title="Profile | Ministère de l'EDU-NC" />
                    <Profile />
                  </>
                }
              />
              <Route
                path="/forms/form-elements"
                element={
                  <>
                    <PageTitle title="Form Elements | Ministère de l'EDU-NC" />
                    <FormElements />
                  </>
                }
              />
              <Route
                path="/forms/form-layout"
                element={
                  <>
                    <PageTitle title="Form Layout | Ministère de l'EDU-NC" />
                    <FormLayout />
                  </>
                }
              />
              <Route
                path="/tables"
                element={
                  <>
                    <PageTitle title="Tables | Ministère de l'EDU-NC" />
                    <Tables />
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <PageTitle title="Settings | Ministère de l'EDU-NC" />
                    <Settings />
                  </>
                }
              />
              <Route
                path="/chart"
                element={
                  <>
                    <PageTitle title="Basic Chart | Ministère de l'EDU-NC" />
                    <Chart />
                  </>
                }
              />
              <Route
                path="/ui/alerts"
                element={
                  <>
                    <PageTitle title="Alerts | Ministère de l'EDU-NC" />
                    <Alerts />
                  </>
                }
              />
              <Route
                path="/ui/buttons"
                element={
                  <>
                    <PageTitle title="Buttons | Ministère de l'EDU-NC" />
                    <Buttons />
                  </>
                }
              />
              <Route
                path="/auth/signin"
                element={
                  <>
                    <PageTitle title="Signin | Ministère de l'EDU-NC" />
                    <SignIn />
                  </>
                }
              />
              <Route
                path="/auth/signup"
                element={
                  <>
                    <PageTitle title="Signup | Ministère de l'EDU-NC" />
                    <SignUp />
                  </>
                }
              />
              <Route
                path="/rapport-activite"
                element={
                  <>
                    <PageTitle title="Rapports d'activité | Ministère de l'EDU-NC" />
                    <RapportActivitePage />
                  </>
                }
              />
              <Route
                path="/rapport-activite/create"
                element={
                  <>
                    <PageTitle title="Créer un rapport d'activité | Ministère de l'EDU-NC" />
                    <CreateRapportActivite />
                  </>
                }
              />
              <Route
                path="/rapport-activite/view/:id"
                element={
                  <>
                    <PageTitle title="Détail du rapport d'activité | Ministère de l'EDU-NC" />
                    <RapportActivitePage />
                  </>
                }
              />
              <Route
                path="/rapport-activite/edit/:id"
                element={
                  <>
                    <PageTitle title="Modifier le rapport d'activité | Ministère de l'EDU-NC" />
                    <CreateRapportActivite />
                  </>
                }
              />
            </Routes>
          </DefaultLayout>
        }
      />
    </Routes>
  );
}

export default App;
