import { Component, OnInit, inject } from '@angular/core';
import { StoreService } from './store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans">
      <!-- Navbar -->
      <nav class="border-b border-[#1F1F21] bg-[#0D0D0E]/80 backdrop-blur sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#8C6F3D] flex items-center justify-center font-serif font-bold text-[#0A0A0B] text-xl">L</div>
            <a href="/" class="font-serif text-2xl tracking-widest uppercase text-white">Lensen.art</a>
          </div>
          <div class="flex gap-6 items-center">
            <a href="#" class="text-sm tracking-widest text-[#8E8E93] hover:text-[#C5A059] transition-colors uppercase">Portfolio</a>
            <a href="#" class="text-sm tracking-widest text-white hover:text-[#C5A059] transition-colors uppercase">Store</a>
            <a href="/admin" class="text-sm tracking-widest text-[#8E8E93] hover:text-white transition-colors uppercase border border-[#2D2D30] px-4 py-2 rounded-lg hover:border-[#C5A059]">Admin Login</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <h1 class="font-serif text-5xl md:text-7xl text-white mb-6 uppercase tracking-tight">Cinematography Prints</h1>
        <p class="text-lg md:text-xl text-[#8E8E93] max-w-2xl font-light">Exclusive, limited-edition lithographs and prints from the portfolio of Yang Sen. Museum-grade quality.</p>
      </section>

      <!-- Products Grid -->
      <section class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          @for (product of store.products(); track product.id) {
            <div class="group cursor-pointer flex flex-col">
              <div class="overflow-hidden rounded-xl bg-[#151517] aspect-[4/5] relative mb-6">
                <!-- Image -->
                <img [src]="product.image" alt="{{ product.title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                
                <!-- Overlay Action -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button (click)="buy(product.id)" class="px-8 py-3 bg-[#C5A059] text-[#0A0A0B] font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                    Purchase
                  </button>
                </div>
              </div>
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-serif text-xl text-white mb-2">{{ product.title }}</h3>
                  <p class="text-sm text-[#8E8E93] line-clamp-2 max-w-xs">{{ product.description }}</p>
                </div>
                <div class="text-lg font-mono text-[#C5A059]">
                  €{{ (product.price / 100) | number:'1.2-2' }}
                </div>
              </div>
            </div>
          }
          @if (store.products().length === 0) {
            <div class="col-span-full py-20 text-center text-[#8E8E93] border border-dashed border-[#2D2D30] rounded-xl">
              <p class="text-lg">No prints available in the store yet.</p>
              <a href="/admin" class="text-[#C5A059] hover:underline mt-4 inline-block">Go to Admin to add prints</a>
            </div>
          }
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-[#1F1F21] mt-24 py-12">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[#8E8E93] text-sm">
          <p>&copy; 2026 Yang Sen • Lensen.art. All rights reserved.</p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <span>Powered by Namecheap cPanel</span>
            <span class="text-[#2D2D30]">|</span>
            <span>Secure payments by Stripe</span>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class StorefrontComponent implements OnInit {
  store = inject(StoreService);

  ngOnInit() {
    this.store.fetchProducts();
  }

  buy(productId: string) {
    this.store.checkout(productId);
  }
}
