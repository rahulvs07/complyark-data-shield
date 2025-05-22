
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Array<"system-admin" | "org-admin" | "user">;
  redirectTo?: string;
};

const ProtectedRoute = ({
  children,
  allowedRoles = ["system-admin", "org-admin", "user"],
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { user, isSystemAdmin, isOrgAdmin, isUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    const userRoles = [];
    if (isSystemAdmin) userRoles.push("system-admin");
    if (isOrgAdmin) userRoles.push("org-admin");
    if (isUser) userRoles.push("user");

    const hasAllowedRole = userRoles.some((role) => allowedRoles.includes(role as any));
    
    if (!hasAllowedRole) {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, isSystemAdmin, isOrgAdmin, isUser, loading, allowedRoles, redirectTo, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
