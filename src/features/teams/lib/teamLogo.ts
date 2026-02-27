const apiBaseUrl = import.meta.env.VITE_API_URL;

export function getTeamLogoSrc(logoUri: string) {
  if (!logoUri) {
    return '';
  }

  if (logoUri.startsWith('http://') || logoUri.startsWith('https://')) {
    return logoUri;
  }

  if (!apiBaseUrl) {
    return logoUri;
  }

  const normalizedLogoUri = logoUri.replace(/\\/g, '/');
  return new URL(normalizedLogoUri, apiBaseUrl).toString();
}
