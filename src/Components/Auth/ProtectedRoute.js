import { Navigate } from "react-router-dom";
import { useAuth } from "../../Common/AuthContext";
import { ROUTES } from "../../Common/Constants";

export function ProtectedRoute({ children, userRole }) {
  const { user } = useAuth();
  if (!user || user.userRole !== userRole) {
    return <Navigate to={ROUTES.login} />;
  }
  return children;
}
