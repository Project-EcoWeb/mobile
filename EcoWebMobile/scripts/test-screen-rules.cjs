const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Executa as funções reais de produção, sem depender do runtime React Native.
function loadTypescript(relativePath) {
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, URL });
  return exports;
}

const { getResponsiveLayout } = loadTypescript('src/utils/responsiveLayout.ts');
const { isProtectedRoute, getAuthenticationDestination } = loadTypescript('src/navigation/accessControl.ts');
const { isHttpUrl } = loadTypescript('src/utils/validation.ts');

test('grades adaptam-se à largura e ao tamanho de texto preferido', () => {
  for (const [width, scale, columns] of [[320, 1, 1], [360, 1, 2], [430, 1, 2], [768, 1, 3], [390, 1.5, 1], [430, 2, 1]]) {
    assert.equal(getResponsiveLayout(width, 844, scale).gridColumns, columns);
  }
  assert.equal(getResponsiveLayout(320, 568).isCompact, true);
  assert.equal(getResponsiveLayout(390, 844, 1.5).isCompact, true);
});

test('imagens de destaque não consomem toda a altura no modo horizontal', () => {
  assert.equal(getResponsiveLayout(568, 320).heroHeight, 160);
  assert.equal(getResponsiveLayout(430, 932).heroHeight, 320);
  assert.ok(getResponsiveLayout(320, 568).featuredWidth <= 320 - 40);
});

test('catálogo público e ferramentas pessoais mantêm regras distintas', () => {
  for (const route of ['/dashboard', '/project', '/material', '/search', '/project/abc', '/material/abc', '/institution/abc']) assert.equal(isProtectedRoute(route), false, route);
  for (const route of ['/profile', '/profile/messages', '/profile/favorites', '/project/me', '/material/me', '/project/register', '/material/register', '/chat/abc']) assert.equal(isProtectedRoute(route), true, route);
});

test('login preserva destinos válidos e rejeita destinos externos ou inexistentes', () => {
  for (const route of ['/project/register', '/material/register', '/profile/favorites', '/chat/abc', '/search?query=garrafa']) assert.equal(getAuthenticationDestination(route), route);
  for (const route of [undefined, ['/project/me'], 'https://example.com', '//example.com', '/login', '/auth/register', '/profile/unknown', '/chat', '/project/../login']) assert.equal(getAuthenticationDestination(route), '/dashboard');
});

test('formulários aceitam apenas URLs HTTP ou HTTPS completas', () => {
  for (const url of ['https://example.com/image.jpg', ' http://example.com/video ']) assert.equal(isHttpUrl(url), true);
  for (const url of ['', undefined, 'example.com', 'file:///tmp/image.jpg', 'javascript:alert(1)', 'data:image/png;base64,abc']) assert.equal(isHttpUrl(url), false);
});
