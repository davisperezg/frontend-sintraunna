import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "../views/Login/LoginScreen";
import { DashboardRoutes } from "./DashboardRoutes";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          }
        />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
