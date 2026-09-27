import React, { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { isAuthenticationRoute, isProtectedRoute } from "../src/navigation/accessControl";

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

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user && isProtectedRoute(pathname)) {
      router.replace("/login");
    }

    if (user && (pathname === "/" || isAuthenticationRoute(pathname))) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
