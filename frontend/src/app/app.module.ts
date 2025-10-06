import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthDialogComponent } from './components/auth-dialog.component';

import { HttpClientModule } from '@angular/common/http';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Components
import { AppComponent } from './components/app.component';
import { CatalogComponent } from './components/catalog.component';
import { ProductDetailComponent } from './components/product-detail.component';
import { CartComponent } from './components/cart.component';
import { CheckoutComponent } from './components/checkout.component';

// Services
import { CartService } from './services/cart.service';
import { ProductService } from './services/product.service';
import { ApiService } from './services/api.service';
import { AppRoutingModule } from './app-routing.module';
import { ProductListComponent } from './components/product-list.component';

const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'auth', component: AuthDialogComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    ProductDetailComponent,
    CartComponent,
    AuthDialogComponent,
    CheckoutComponent,
    ProductListComponent 
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Angular Material
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ]
  ,
  providers: [CartService, ProductService, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
