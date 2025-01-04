import "./App.css";
import { CssBaseline } from "@mui/material/";
import BuildBlock from "./screens/BuildBlock";
import { StyledEngineProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <ColorModeProvider>
      <CssBaseline>
        <StyledEngineProvider injectFirst>
          <AuthProvider>
            <BrowserRouter>
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
                  />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </StyledEngineProvider>
      </CssBaseline>
    </ColorModeProvider>
  );
}

export default App;
