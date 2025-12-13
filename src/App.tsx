import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
//import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import Organisme from "./pages/Organisme";
import CreateOrganisme from "./pages/Organisme/create";
import EditOrganisme from "./pages/Organisme/edit";
import Projets from "./pages/Projets";
import CreatedProjet from "./pages/Projets/create";
import EditProjet from "./pages/Projets/edit";
import ShowProjet from "./pages/Projets/show";
import ProjetsPromulgues from "./pages/Projets/promulgues";
import ProjetsAVoter from "./pages/Projets/avoter";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout */}
            <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route index path="/" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />

              {/* Projets - Routes spécifiques AVANT les routes dynamiques */}
              <Route path="/projets" element={<Projets />} />
              <Route path="/projets/create" element={<CreatedProjet />} />
              <Route path="/projets/promulgues" element={<ProjetsPromulgues />} />
              <Route path="/projets/avoter" element={<ProjetsAVoter />} />
              <Route path="/projets/edit/:id" element={<EditProjet />} />
              <Route path="/projets/:id" element={<ShowProjet />} />

              {/* Organismes - Routes spécifiques AVANT les routes dynamiques */}
              <Route path="/organisme" element={<Organisme />} />
              <Route path="/organisme/create" element={<CreateOrganisme />} />
              <Route path="/organisme/edit/:id" element={<EditOrganisme />} />

              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
            {/* Auth Layout */}
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
