export function resolveImageUrl(url) {
  if (!url) return '';
  if (/^(https?:|data:|blob:|\/)/i.test(url)) return url;
  return `/${url.replace(/^\.?\//, '')}`;
}
