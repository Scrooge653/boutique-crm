import { DEFAULT_REGION, REGIONS, regionFromHost } from './regions.js';

// Supports Cloudflare (CF-IPCountry), common reverse-proxy country headers, then
// explicit region choice saved in a cookie. Trust geo headers only from your proxy/CDN.
export function regionalize(req, res, next) {
  const hostRegion = regionFromHost(req.hostname || req.headers.host || '');
  const cookieRegion = String(req.cookies?.atelier_region || '').toUpperCase();
  const geoCountry = String(req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || req.headers['cloudfront-viewer-country'] || '').toUpperCase();
  const geoRegion = REGIONS[geoCountry] ? geoCountry : null;
  const region = hostRegion || (REGIONS[cookieRegion] ? cookieRegion : geoRegion) || DEFAULT_REGION;
  req.regionCode = region;
  req.region = REGIONS[region];
  res.setHeader('Content-Language', req.region.locale);
  res.setHeader('Vary', 'Host, Cookie, CF-IPCountry, X-Vercel-IP-Country, CloudFront-Viewer-Country');
  next();
}
