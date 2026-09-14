import { useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

/** Redirects visitors only when they attempt an action that needs an account. */
export function useAuthenticationGate() {
  const router = useRouter();
  const { user } = useAuth();

  const requireAuthentication = useCallback(() => {
    if (user) {
      return true;
    }

    router.push("/login");
    return false;
  }, [router, user]);

  const navigateWithAuthentication = useCallback(
    (pathname: string) => {
      if (!requireAuthentication()) {
        return;
      }

      router.push(pathname as never);
    },
    [requireAuthentication, router]
  );

  return {
    isAuthenticated: Boolean(user),
    requireAuthentication,
    navigateWithAuthentication,
  };
}
