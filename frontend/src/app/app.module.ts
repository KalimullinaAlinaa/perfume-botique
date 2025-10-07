import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app.component';
import { ProductListComponent } from './components/product-list.component';
import { CartComponent } from './components/cart.component';
import { CheckoutComponent } from './components/checkout.component';
import { AuthDialogComponent } from './components/auth-dialog.component';

// Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Services
import { AuthInterceptor } from './services/auth.interceptor';

// Routes
import { routes } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CartComponent,
    CheckoutComponent,
    AuthDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, 
    RouterModule.forRoot(routes),
    
    // Material modules
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }