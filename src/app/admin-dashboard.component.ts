import { Component, OnInit, inject } from '@angular/core';
import { StoreService } from './store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-screen w-full bg-[#0A0A0B] text-[#E0E0E0] font-sans overflow-hidden">
      <!-- Sidebar Navigation -->
      <aside class="w-64 border-r border-[#1F1F21] flex flex-col bg-[#0D0D0E] shrink-0">
        <div class="p-8 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#8C6F3D] flex items-center justify-center font-serif font-bold text-[#0A0A0B]">L</div>
          <span class="font-serif text-xl tracking-widest uppercase">Lensen.art</span>
        </div>
        <nav class="flex-1 px-4 space-y-1">
          <div class="p-3 bg-[#1F1F21] rounded-lg border border-[#2D2D30] flex items-center gap-3 cursor-pointer">
            <svg class="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="text-sm font-medium">Dashboard</span>
          </div>
          <div class="p-3 text-[#8E8E93] hover:bg-[#151517] rounded-lg flex items-center gap-3 transition-colors cursor-pointer" routerLink="/">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span class="text-sm font-medium">Back to Store</span>
          </div>
        </nav>
        <div class="p-4 mt-auto border-t border-[#1F1F21]">
          <div class="flex items-center gap-3 p-3 bg-[#151517] rounded-lg">
            <div class="w-2 h-2 rounded-full bg-[#34C759]"></div>
            <span class="text-xs text-[#8E8E93] uppercase tracking-widest">Stripe Connected</span>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col p-8 overflow-y-auto">
        <!-- Header -->
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-serif text-white mb-1">Admin Dashboard</h1>
            <p class="text-sm text-[#8E8E93]">Lensen Management Interface • Namecheap cPanel Linked</p>
          </div>
          <div class="flex gap-4">
            <button (click)="refresh()" class="px-4 py-2 border border-[#2D2D30] rounded-lg text-xs uppercase tracking-widest hover:bg-[#1F1F21] transition-all cursor-pointer">Refresh Sync</button>
            <button (click)="createNewPost()" class="px-6 py-2 bg-[#C5A059] text-[#0A0A0B] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#d6af66] transition-colors">New Store Post</button>
          </div>
        </header>

        <!-- Stats Grid -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-[#0D0D0E] border border-[#1F1F21] p-6 rounded-xl">
            <span class="text-xs text-[#8E8E93] uppercase tracking-widest mb-4 block">Net Revenue</span>
            <div class="text-2xl font-serif text-white">€{{ totalRevenue() }}</div>
            <div class="text-xs text-[#34C759] mt-2">Active balance</div>
          </div>
          <div class="bg-[#0D0D0E] border border-[#1F1F21] p-6 rounded-xl">
            <span class="text-xs text-[#8E8E93] uppercase tracking-widest mb-4 block">Total Orders</span>
            <div class="text-2xl font-serif text-white">{{ store.orders().length }}</div>
            <div class="text-xs text-[#C5A059] mt-2">All time</div>
          </div>
          <div class="bg-[#0D0D0E] border border-[#1F1F21] p-6 rounded-xl">
            <span class="text-xs text-[#8E8E93] uppercase tracking-widest mb-4 block">Stripe Status</span>
            <div class="text-2xl font-serif text-white">Operational</div>
            <div class="text-xs text-[#34C759] mt-2">Gateway Active</div>
          </div>
          <div class="bg-[#0D0D0E] border border-[#1F1F21] p-6 rounded-xl">
            <span class="text-xs text-[#8E8E93] uppercase tracking-widest mb-4 block">Products Live</span>
            <div class="text-2xl font-serif text-white">{{ store.products().length }}</div>
            <div class="text-xs text-[#8E8E93] mt-2">Available in store</div>
          </div>
        </section>

        <!-- Bottom Split View -->
        <div class="flex-1 flex flex-col xl:flex-row gap-8">
          <!-- Recent Orders List -->
          <section class="flex-[1.5] flex flex-col">
            <h2 class="text-xs uppercase tracking-widest text-[#8E8E93] mb-4">Recent Stripe Transactions</h2>
            <div class="flex-1 bg-[#0D0D0E] border border-[#1F1F21] rounded-xl overflow-hidden flex flex-col">
              <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[600px]">
                  <thead>
                    <tr class="border-b border-[#1F1F21] bg-[#151517]">
                      <th class="p-4 text-xs font-semibold uppercase tracking-tighter text-[#E0E0E0]">Customer</th>
                      <th class="p-4 text-xs font-semibold uppercase tracking-tighter text-[#E0E0E0]">Product ID</th>
                      <th class="p-4 text-xs font-semibold uppercase tracking-tighter text-[#E0E0E0]">Status</th>
                      <th class="p-4 text-xs font-semibold uppercase tracking-tighter text-right text-[#E0E0E0]">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="text-sm divide-y divide-[#1F1F21]">
                    @for (order of store.orders(); track order.id) {
                      <tr>
                        <td class="p-4">
                          <div class="font-medium text-[#E0E0E0]">{{ order.customerName }}</div>
                          <div class="text-xs text-[#8E8E93]">{{ order.customerEmail }}</div>
                        </td>
                        <td class="p-4 text-[#C5A059] italic">{{ order.productId }}</td>
                        <td class="p-4">
                          <span class="px-2 py-1 bg-[#1A3321] text-[#34C759] rounded text-[10px] uppercase font-bold">
                            {{ order.status }}
                          </span>
                        </td>
                        <td class="p-4 text-right font-mono text-[#E0E0E0]">€{{ (order.amount / 100) | number:'1.2-2' }}</td>
                      </tr>
                    }
                    @if (store.orders().length === 0) {
                      <tr>
                        <td colspan="4" class="p-8 text-center text-[#8E8E93] italic">No real orders yet. (Mocking data if none)</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- Quick Controls / cPanel Link -->
          <section class="flex-1 flex flex-col">
            <h2 class="text-xs uppercase tracking-widest text-[#8E8E93] mb-4">Infrastructure</h2>
            <div class="bg-[#0D0D0E] border border-[#1F1F21] rounded-xl p-6 flex flex-col gap-6">
              <div>
                <label for="stripeKey" class="text-[10px] text-[#8E8E93] uppercase mb-2 block">Stripe API Key</label>
                <div class="flex items-center gap-2">
                  <input id="stripeKey" type="password" value="sk_test_********************" class="bg-[#151517] border border-[#2D2D30] rounded p-2 text-xs flex-1 font-mono text-[#8E8E93] focus:outline-none" readonly>
                  <button class="p-2 bg-[#1F1F21] rounded border border-[#2D2D30] text-[#E0E0E0] cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                  </button>
                </div>
              </div>
              <div class="p-4 border border-[#2D2D30] rounded-lg bg-[#151517] flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold uppercase text-[#E0E0E0]">cPanel Integration</div>
                  <div class="text-[10px] text-[#8E8E93]">Node.js app on lensen.art Namecheap hosting</div>
                </div>
                <div class="w-8 h-8 rounded bg-[#FF6C2C] flex items-center justify-center text-white font-bold text-xs">cP</div>
              </div>
              <button class="w-full py-3 bg-white text-[#0A0A0B] rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-colors">Enter Maintenance Mode</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  store = inject(StoreService);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.store.fetchProducts();
    this.store.fetchOrders();
  }

  totalRevenue() {
    const sum = this.store.orders().reduce((acc, order) => acc + order.amount, 0);
    return (sum / 100).toFixed(2);
  }

  createNewPost() {
    const title = prompt('Product Name (e.g. New Abstract Horizon):');
    if (!title) return;
    const priceStr = prompt('Price in EUR (e.g. 150):');
    const price = parseInt(priceStr || '0', 10) * 100;
    if (!price) return;
    const image = prompt('Image URL (unsplash is fine for now):', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop');
    
    this.store.createProduct({
      title,
      price,
      description: 'Newly uploaded post from Namecheap cPanel admin.',
      image: image || ''
    });
  }
}
