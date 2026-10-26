# Atelier — boutique et CRM

Socle full-stack : boutique HTML existante, API Node/Express, base SQLite locale, comptes clients, sessions sécurisées par cookie HttpOnly, commandes transactionnelles avec décrémentation du stock, endpoints d'administration.

## Prérequis
Node.js 20 ou plus. Installer avec `npm install`, copier `.env.example` vers `.env`, puis remplacer `JWT_SECRET` par une valeur aléatoire forte (`openssl rand -hex 32`). Lancer `npm run dev` puis ouvrir `http://localhost:3000`.

La base SQLite est créée automatiquement dans `data/atelier.sqlite`. Pour installer les dépendances natives SQLite, une toolchain de compilation peut être nécessaire selon le système.

## API disponible
- `GET /api/products`, `/api/categories`
- `POST /api/auth/register` (`name,email,password`), `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/me`
- `GET /api/orders`, `POST /api/orders` (client connecté; lignes `{productId,quantity}`)
- Admin : `GET /api/admin/summary`, `GET /api/admin/customers`, `POST /api/admin/products`, `PATCH /api/admin/orders/:id`

## Mise en production — indispensable
Ce dépôt fournit les fondations backend, pas une boutique prête à traiter des paiements en argent réel. Le checkout réserve/décrémente les quantités mais ne débite aucune carte. Ajouter un prestataire (Stripe/équivalent) et valider les paiements par webhook avant d'expédier. Configurer HTTPS, secrets hors dépôt, sauvegardes et restauration, limitation de débit, politique de confidentialité/RGPD et tests. Le rôle admin ne peut pas être attribué par l'inscription publique; créer le premier administrateur de façon contrôlée directement en base après inscription, par exemple `UPDATE users SET role='admin' WHERE email='adresse-verifiee@example.com';`. Ne jamais exposer le fichier SQLite publiquement.

Les commandes, clients, produits et ventes fictifs de la maquette ne sont pas importés et ne constituent pas des données réelles.