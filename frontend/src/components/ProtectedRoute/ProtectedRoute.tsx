import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { Routes } from "./../../interfaces/routes";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={Routes.LOGIN} />;
  }

  return children;
};

export default ProtectedRoute;
