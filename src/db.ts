import { join } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const dbPath = join(import.meta.dirname, 'data.json');

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  inventory?: number;
}

export interface Order {
  id: string;
  sessionId: string;
  customerEmail: string;
  customerName: string;
  productId: string;
  status: 'pending' | 'success' | 'failed';
  amount: number;
  createdAt: string;
}

export interface Database {
  products: Product[];
  orders: Order[];
}

const defaultData: Database = {
  products: [
    {
      id: 'prod_1',
      title: 'Neon Genesis Litho',
      description: 'Exclusive lithograph by Yang Sen. 300gsm matte paper.',
      price: 22000, // in cents -> €220.00
      image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'prod_2',
      title: 'Shadow Play #04',
      description: 'Abstract horizon photography series. Limited edition.',
      price: 45000, // €450.00
      image: 'https://images.unsplash.com/photo-1620612984920-56d11cdfacb7?q=80&w=800&auto=format&fit=crop'
    }
  ],
  orders: []
};

export function getDb(): Database {
  if (!existsSync(dbPath)) {
    saveDb(defaultData);
    return defaultData;
  }
  try {
    const data = readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (_) {
    return defaultData;
  }
}

export function saveDb(db: Database) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
