import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from 'react-redux'
import { init } from '@rematch/core'
import { tokenModel, userModel, usersModel } from './models'
import {useRedirect} from './hooks'
import MainPage from "./routes/Main";
import ProfilePage from "./routes/Profile";
import SignInPage from "./routes/SignIn";
import AdminPage from './routes/Admin';

const store = init({
  models: {
    token: tokenModel,
    user: userModel,
    users: usersModel
  }
})

const AppRoutes = () => {
  useRedirect()

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />
    </Routes>
  )
}

export default function App() {
  return (
      <Provider store={store}>
        <AppRoutes />
      </Provider>
  );
}

function RequireAuth({ children }) {
  const location = useLocation();
  const token = useSelector((state) => state.token)
  if (!token.access_token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
