# Atelier — boutique et CRM

Socle full-stack : boutique HTML existante, API Node/Express, base SQLite locale, comptes clients, sessions sécurisées par cookie HttpOnly, commandes transactionnelles avec décrémentation du stock, endpoints d'administration et configuration régionale.

## Prérequis
Node.js 20 ou plus. Installer avec `npm install`, copier `.env.example` vers `.env`, puis remplacer `JWT_SECRET` par une valeur aléatoire forte (`openssl rand -hex 32`). Lancer `npm run dev` puis ouvrir `http://localhost:3000`.

La base SQLite est créée automatiquement dans `data/atelier.sqlite`. Pour installer les dépendances natives SQLite, une toolchain de compilation peut être nécessaire selon le système.

## Domaines et régions
L’API suggère la région d’après le domaine (prioritaire), puis le pays fourni par le proxy/CDN (Cloudflare `CF-IPCountry`, Vercel `X-Vercel-IP-Country`, CloudFront), puis le choix enregistré par le client. Il ne s’agit pas d’une géolocalisation GPS. En cas de VPN ou d’erreur IP, le client doit pouvoir choisir manuellement son pays. Les en-têtes de géolocalisation ne doivent être acceptés que derrière le CDN/proxy de confiance.

Régions configurées : Sénégal `.sn` / XOF, Gabon `.ga` / XAF, Côte d’Ivoire `.ci` / XOF, Cameroun `.cm` / XAF, France `.fr` / EUR. Les domaines sont des exemples à enregistrer : `atelier.sn`, `atelier.ga`, etc. Il faut acheter/enregistrer chaque domaine auprès d’un registrar, vérifier les règles locales, pointer DNS vers l’hébergeur et activer un certificat TLS pour chacun. Le code ne peut pas acheter ni rendre ces domaines actifs à votre place. Si vous utilisez votre propre nom de marque, remplacez `atelier` dans `src/regions.js` et dans vos réglages DNS.

Endpoints: `GET /api/region` lit la région active; `POST /api/region` avec `{"code":"SN"}` enregistre un choix; `DELETE /api/region` efface ce choix. Le cookie mémorise le choix pendant un an.

**Attention devises :** la région peut définir le format et la devise d’affichage, mais ce socle ne convertit pas les prix ni ne gère des comptes de règlement multi-devises. Configurez le prix et le prestataire de paiement par marché avant de proposer des ventes; ne convertissez pas les montants en changeant seulement le symbole. XOF et XAF sont deux devises distinctes.

## API disponible
- `GET /api/products`, `/api/categories`
- `POST /api/auth/register` (`name,email,password`), `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/me`
- `GET /api/orders`, `POST /api/orders` (client connecté; lignes `{productId,quantity}`)
- Admin : `GET /api/admin/summary`, `GET /api/admin/customers`, `POST /api/admin/products`, `PATCH /api/admin/orders/:id`
- Région : `GET /api/region`, `POST /api/region`, `DELETE /api/region`

## Mise en production — indispensable
Ce dépôt fournit les fondations backend, pas une boutique prête à traiter des paiements en argent réel. Le checkout réserve/décrémente les quantités mais ne débite aucune carte. Ajouter un prestataire (Stripe/équivalent) et valider les paiements par webhook avant d'expédier. Configurer HTTPS, secrets hors dépôt, sauvegardes et restauration, limitation de débit, politique de confidentialité/RGPD et tests. Le rôle admin ne peut pas être attribué par l'inscription publique; créer le premier administrateur de façon contrôlée directement en base après inscription, par exemple `UPDATE users SET role='admin' WHERE email='adresse-verifiee@example.com';`. Ne jamais exposer le fichier SQLite publiquement.

Les commandes, clients, produits et ventes fictives de la maquette ne sont pas importés et ne constituent pas des données réelles.
