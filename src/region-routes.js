import { REGIONS, DEFAULT_REGION } from './regions.js';

export function registerRegionRoutes(app) {
  app.get('/api/region', (req, res) => res.json({ code: req.regionCode, ...req.region, source: req.regionSource || 'automatic-or-default' }));
  app.post('/api/region', (req, res) => {
    const code = String(req.body?.code || '').toUpperCase();
    if (!REGIONS[code]) return res.status(400).json({ error: 'Pays/région non pris en charge', supported: Object.keys(REGIONS) });
    res.cookie('atelier_region', code, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 31536000000, path: '/' });
    res.json({ code, ...REGIONS[code] });
  });
  app.delete('/api/region', (_req, res) => res.clearCookie('atelier_region', { path: '/' }).status(204).end());
}

// Exported for clients that need a stable fallback.
export const defaultRegionCode = DEFAULT_REGION;
