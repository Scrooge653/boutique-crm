// Configuration régionale côté serveur. La géolocalisation IP sert uniquement de suggestion :
// l'utilisateur peut toujours choisir son pays, notamment en cas de VPN ou d'erreur de localisation.
export const REGIONS = {
  SN: { country: 'Sénégal', tld: 'sn', currency: 'XOF', currencyName: 'franc CFA BCEAO', locale: 'fr-SN', flag: '🇸🇳' },
  GA: { country: 'Gabon', tld: 'ga', currency: 'XAF', currencyName: 'franc CFA BEAC', locale: 'fr-GA', flag: '🇬🇦' },
  CI: { country: 'Côte d’Ivoire', tld: 'ci', currency: 'XOF', currencyName: 'franc CFA BCEAO', locale: 'fr-CI', flag: '🇨🇮' },
  CM: { country: 'Cameroun', tld: 'cm', currency: 'XAF', currencyName: 'franc CFA BEAC', locale: 'fr-CM', flag: '🇨🇲' },
  FR: { country: 'France', tld: 'fr', currency: 'EUR', currencyName: 'euro', locale: 'fr-FR', flag: '🇫🇷' },
};
export const DEFAULT_REGION = 'FR';

export function regionFromHost(host = '') {
  const hostname = host.split(':')[0].toLowerCase().replace(/\.$/, '');
  for (const [code, region] of Object.entries(REGIONS)) {
    if (hostname === `atelier.${region.tld}` || hostname.endsWith(`.atelier.${region.tld}`)) return code;
  }
  return null;
}
