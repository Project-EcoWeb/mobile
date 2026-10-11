import React, { useEffect } from "react";
import { Stack, useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { getAuthenticationDestination, isAuthenticationRoute, isProtectedRoute } from "../src/navigation/accessControl";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

function Layout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { redirect } = useGlobalSearchParams<{ redirect?: string }>();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user && isProtectedRoute(pathname)) {
      router.replace({ pathname: "/login", params: { redirect: pathname } });
    }

    if (user && (pathname === "/" || isAuthenticationRoute(pathname))) {
      router.replace((isAuthenticationRoute(pathname) ? getAuthenticationDestination(redirect) : "/dashboard") as never);
    }
  }, [user, isLoading, router, pathname, redirect]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
