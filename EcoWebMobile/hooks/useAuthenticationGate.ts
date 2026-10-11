import { useCallback } from "react";
import { usePathname, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

/** Redirects visitors only when they attempt an action that needs an account. */
export function useAuthenticationGate() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const requireAuthentication = useCallback((redirectTo = pathname) => {
    if (user) {
      return true;
    }

    router.push({ pathname: "/login", params: { redirect: redirectTo } });
    return false;
  }, [pathname, router, user]);

  const navigateWithAuthentication = useCallback(
    (pathname: string) => {
      if (!requireAuthentication(pathname)) {
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
