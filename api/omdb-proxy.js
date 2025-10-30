const cache = new Map();
const CACHE_TTL = 60 * 1000;

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function saveToCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

function validateParams(query) {
  const { s, i, page } = query;
  
  if (!s && !i) {
    return { valid: false, error: 'Missing required parameter: s or i' };
  }
  
  if (s && s.trim().length < 2) {
    return { valid: false, error: 'Search term must be at least 2 characters' };
  }
  
  if (page && (isNaN(page) || parseInt(page) < 1 || parseInt(page) > 100)) {
    return { valid: false, error: 'Invalid page number (must be 1-100)' };
  }
  
  return { valid: true };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      Response: 'False', 
      Error: 'Method not allowed. Use GET.' 
    });
  }
  
  const API_KEY = process.env.VITE_OMDB_API_KEY;
  if (!API_KEY) {
    console.error('Missing VITE_OMDB_API_KEY environment variable');
    return res.status(500).json({ 
      Response: 'False', 
      Error: 'Server configuration error' 
    });
  }
  
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ 
      Response: 'False', 
      Error: 'Too many requests. Please try again later.' 
    });
  }
  
  const validation = validateParams(req.query);
  if (!validation.valid) {
    return res.status(400).json({ 
      Response: 'False', 
      Error: validation.error 
    });
  }
  
  const cacheKey = JSON.stringify(req.query);
  const cachedResponse = getFromCache(cacheKey);
  if (cachedResponse) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cachedResponse);
  }
  
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      ...req.query,
    });
    
    const omdbUrl = `https://www.omdbapi.com/?${params.toString()}`;
    const response = await fetch(omdbUrl);
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'True') {
      saveToCache(cacheKey, data);
    }
    
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      Response: 'False', 
      Error: 'Failed to fetch data from OMDb API' 
    });
  }
}

