import { CssBaseline } from "@mui/material/";
import BuildBlock from "./screens/BuildBlock";
import { StyledEngineProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import SRF from "./screens/SRF";
import NoPage from "./screens/NoPage/NoPage";
import AppBar from "./../src/components/AppBar";
import Home from "./screens/Home";
import Contact from "./screens/Contact";
import ColorModeProvider from "./context/ColorModeContext";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./screens/Account";
import LanguageProvider from "./context/LanguageContext";
import PersonalInfo from "./screens/PersonalInfo";
import BuildBlockSubmissions from "./screens/BuildBlockSubmissions";
import Preferences from "./screens/Preferences";
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <ColorModeProvider>
      <CssBaseline>
        <StyledEngineProvider injectFirst>
          <LanguageProvider>
            <AuthProvider>
              <HashRouter>
                <Routes>
                  <Route path="/" element={<AppBar />}>
                    <Route index element={<Home />} />
                    <Route path="buildblock" element={<BuildBlock />} />
                    <Route path="srf" element={<SRF />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="login" element={<Login />} />
                    <Route path="sign-up" element={<SignUp />} />
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<PersonalInfo />} />
                      <Route path="preferences" element={<Preferences />} />
                      <Route path="build-block" element={<BuildBlockSubmissions />} />
                    </Route>
                    <Route path="*" element={<NoPage />} />
                  </Route>
                </Routes>
              </HashRouter>
            </AuthProvider>
          </LanguageProvider>
        </StyledEngineProvider>
      </CssBaseline>
    </ColorModeProvider>
  );
}

export default App;
