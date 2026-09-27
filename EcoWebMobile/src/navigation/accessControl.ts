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
