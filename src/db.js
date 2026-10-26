import Database from 'better-sqlite3';
import fs from 'node:fs'; import path from 'node:path';
const file=process.env.DATABASE_FILE||'data/atelier.sqlite';fs.mkdirSync(path.dirname(file),{recursive:true});
const db=new Database(file);db.pragma('journal_mode = WAL');db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY,name TEXT NOT NULL UNIQUE,slug TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,name TEXT NOT NULL,category_id INTEGER REFERENCES categories(id),description TEXT NOT NULL DEFAULT '',price_cents INTEGER NOT NULL CHECK(price_cents>=0),stock INTEGER NOT NULL DEFAULT 0 CHECK(stock>=0),image_url TEXT NOT NULL DEFAULT '',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),total_cents INTEGER NOT NULL CHECK(total_cents>=0),status TEXT NOT NULL DEFAULT 'pending',shipping_address TEXT NOT NULL DEFAULT '{}',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS order_items(id INTEGER PRIMARY KEY,order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,product_id INTEGER NOT NULL REFERENCES products(id),quantity INTEGER NOT NULL CHECK(quantity>0),unit_price_cents INTEGER NOT NULL CHECK(unit_price_cents>=0));
CREATE TABLE IF NOT EXISTS newsletter(id INTEGER PRIMARY KEY,email TEXT NOT NULL UNIQUE,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`);
const count=db.prepare('SELECT COUNT(*) n FROM categories').get().n;if(!count){const add=db.prepare('INSERT INTO categories(name,slug) VALUES(?,?)');for(const [n,s] of [['Vêtements','vetements'],['Chaussures','chaussures'],['Sacs à dos','sacs-a-dos'],['Sacoches','sacoches'],['Sandales','sandales']])add.run(n,s);}
export default db;