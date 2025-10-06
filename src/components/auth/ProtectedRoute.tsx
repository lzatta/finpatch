import { Navigate } from "react-router-dom";
import { useAuthStore, Role } from "@/store/auth";

export default function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: Role }) {
  const user = useAuthStore(s => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
