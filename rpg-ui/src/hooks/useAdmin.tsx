import { useAuth } from "@/contexts/AuthContext";

export function useAdmin() {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log(
    "useAdmin - user:",
    user,
    "isAuthenticated:",
    isAuthenticated,
    "isLoading:",
    isLoading
  );

  const isAdmin = isAuthenticated && user?.is_admin === true;

  console.log("useAdmin - final isAdmin:", isAdmin);

  return { isAdmin, isLoading };
}
