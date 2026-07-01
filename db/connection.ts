declare const process: { env: Record<string, string | undefined> };

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';

let dbInstance: any = null;
let poolInstance: mysql.Pool | null = null;
let dbAvailable = false;
let dbChecked = false;

// In-memory fallback storage
const memStore: Record<string, any[]> = {};
let memId = 1;

export { dbAvailable };

export async function tryConnect() {
  if (dbChecked) return dbAvailable;
  dbChecked = true;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn('[DB] DATABASE_URL not set. Using in-memory storage (data resets on restart).');
    dbAvailable = false;
    return false;
  }

  try {
    poolInstance = mysql.createPool(dbUrl);
    const conn = await poolInstance.getConnection();
    await conn.ping();
    conn.release();
    dbInstance = drizzle(poolInstance, { schema, mode: 'default' });
    dbAvailable = true;
    console.log('[DB] MySQL connected.');
    return true;
  } catch (e: any) {
    console.warn('[DB] MySQL unavailable:', e.message);
    console.warn('[DB] Using in-memory storage. Run "npm run db:push" when MySQL is ready.');
    dbAvailable = false;
    return false;
  }
}

// Memory helpers
function memInsert(table: string, data: any) {
  if (!memStore[table]) memStore[table] = [];
  const rec = { ...data, id: memId++, createdAt: new Date(), updatedAt: new Date() };
  memStore[table].push(rec);
  return [rec];
}
function memSelect(table: string, where?: Record<string, any>) {
  let data = memStore[table] || [];
  if (where) data = data.filter((r: any) => Object.entries(where).every(([k, v]) => r[k] === v));
  return [...data];
}
function memUpdate(table: string, where: Record<string, any>, data: any) {
  for (const r of (memStore[table] || [])) {
    if (Object.entries(where).every(([k, v]) => r[k] === v)) Object.assign(r, data, { updatedAt: new Date() });
  }
}
function memDelete(table: string, where: Record<string, any>) {
  if (!memStore[table]) return;
  memStore[table] = memStore[table].filter((r: any) => !Object.entries(where).every(([k, v]) => r[k] === v));
}

// Generic safe query wrapper
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  await tryConnect();
  if (!dbAvailable) return fallback;
  try { return await fn(); } catch (e: any) { console.error('[DB Error]', e.message); return fallback; }
}

// Export memory helpers for routers
export { memInsert, memSelect, memUpdate, memDelete, memId };

// Export the raw drizzle db when available
export function getDb() {
  return dbInstance;
}

// Schema tables export
export { schema };
