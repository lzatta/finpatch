import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "../shared/skeleton";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Skeleton className="h-16 w-16" />
      </div>
    );
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
