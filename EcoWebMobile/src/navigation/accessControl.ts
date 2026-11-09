/**
 * Rotas que exigem uma conta autenticada.
 *
 * O catálogo (dashboard, projetos e materiais) é intencionalmente público.
 * Manter a regra centralizada evita que uma nova tela fique exposta ou bloqueada
 * por acidente.
 */
const protectedExactPaths = new Set([
  "/project/me",
  "/project/register",
  "/material/me",
  "/material/register",
  "/profile",
]);

export function isProtectedRoute(pathname: string) {
  return (
    protectedExactPaths.has(pathname) ||
    pathname.startsWith("/profile/") ||
    pathname.startsWith("/chat/")
  );
}

export function isAuthenticationRoute(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/auth/");
}

export function getAuthenticationDestination(redirect?: string | string[]) {
  if (typeof redirect !== "string" || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/dashboard";
  }
  const path = redirect.split(/[?#]/)[0];
  const validPath = protectedExactPaths.has(path) ||
    ["/dashboard", "/search", "/project", "/material", "/profile/messages", "/profile/favorites"].includes(path) ||
    /^\/(project|material|chat|institution)\/[a-zA-Z0-9_-]+$/.test(path);
  return validPath ? redirect : "/dashboard";
}
