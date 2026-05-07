import {Routes} from '@angular/router';
import { StorefrontComponent } from './storefront.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CheckoutSuccessComponent } from './checkout-success.component';

export const routes: Routes = [
  { path: '', component: StorefrontComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'success', component: CheckoutSuccessComponent },
  { path: '**', redirectTo: '' }
];
