import * as React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import MainPage from "./routes/Main";

import ProfilePage from "./routes/Profile";
import SignInPage from "./routes/SignIn";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
      </Routes>
    </AuthProvider>
  );
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
