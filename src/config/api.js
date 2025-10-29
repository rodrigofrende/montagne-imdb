const USE_PROXY = import.meta.env.VITE_USE_API_PROXY === 'true';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const API_CONFIG = {
  baseUrl: USE_PROXY ? '/api/omdb-proxy' : 'https://www.omdbapi.com/',
  apiKey: USE_PROXY ? null : API_KEY,
  useProxy: USE_PROXY,
};

export function buildApiUrl(params) {
  const { baseUrl, apiKey } = API_CONFIG;
  const queryParams = new URLSearchParams();
  
  if (apiKey) {
    queryParams.append('apikey', apiKey);
  }
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      queryParams.append(key, value);
    }
  });
  
  return `${baseUrl}?${queryParams.toString()}`;
}

export function getConfigInfo() {
  return {
    usingProxy: API_CONFIG.useProxy,
    baseUrl: API_CONFIG.baseUrl,
    hasApiKey: !!API_CONFIG.apiKey,
  };
}

