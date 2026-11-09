export function getResponsiveLayout(width: number, height: number, fontScale = 1) {
  const readableWidth = width / Math.max(fontScale, 1);
  return {
    width,
    height,
    isCompact: readableWidth < 360,
    gridColumns: readableWidth < 360 ? 1 : readableWidth >= 700 ? 3 : 2,
    heroHeight: Math.min(320, Math.max(160, height * 0.38)),
    featuredWidth: Math.min(300, Math.max(200, width - 48)),
  };
}
