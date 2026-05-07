import { Injectable, signal } from '@angular/core';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  sessionId: string;
  customerEmail: string;
  customerName: string;
  productId: string;
  status: string;
  amount: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  products = signal<Product[]>([]);
  orders = signal<Order[]>([]);

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      this.products.set(data);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      this.orders.set(data);
    } catch (e) {
      console.error(e);
    }
  }

  async createProduct(product: Partial<Product>) {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      await this.fetchProducts();
    } catch (e) {
      console.error(e);
    }
  }

  async checkout(productId: string) {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout error');
      }
    } catch (e) {
      console.error(e);
    }
  }
}
