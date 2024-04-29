import { Navigate } from "react-router-dom";
import { useAuth } from "../../Common/AuthContext";

export function AuthRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={`/${user.userRole.toLowerCase()}`} />;
  }
  return children;
}
