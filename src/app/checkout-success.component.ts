import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#0A0A0B] flex items-center justify-center font-sans text-center px-4">
      <div class="max-w-md w-full bg-[#0D0D0E] border border-[#1F1F21] p-10 rounded-2xl flex flex-col items-center">
        <!-- Success Icon -->
        <div class="w-20 h-20 rounded-full border-2 border-[#34C759] flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        
        <h1 class="text-3xl font-serif text-white mb-2">Order Confirmed</h1>
        <p class="text-[#8E8E93] mb-8">Thank you for your purchase from Lensen.art. Your transaction was successful.</p>
        
        @if (verifying) {
          <p class="text-xs uppercase tracking-widest text-[#C5A059] animate-pulse">Verifying with Stripe...</p>
        } @else {
          <p class="text-xs uppercase tracking-widest text-[#34C759] mb-8">Verification Complete</p>
        }

        <a href="/" class="w-full py-4 bg-[#C5A059] text-[#0A0A0B] text-sm uppercase tracking-widest font-bold rounded-lg hover:bg-white transition-colors">Return to Gallery</a>
      </div>
    </div>
  `
})
export class CheckoutSuccessComponent implements OnInit {
  route = inject(ActivatedRoute);
  verifying = true;

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const sessionId = params['session_id'];
      if (sessionId) {
        try {
          await fetch('/api/verify-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          this.verifying = false;
        } catch (e) {
          console.error(e);
          this.verifying = false;
        }
      } else {
        this.verifying = false;
      }
    });
  }
}
