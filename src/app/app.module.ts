import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './admin/components/nav/nav.component';
import { UsuariosComponent } from './admin/pages/usuarios/usuarios.component';
import { ProductosComponent } from './admin/pages/productos/productos.component';
import { VentasComponent } from './admin/pages/ventas/ventas.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersService } from './services/users.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AddUserComponent } from './admin/components/add-user/add-user.component';
import { ViewUsersComponent } from './admin/components/view-users/view-users.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatIconModule} from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddProductComponent } from './admin/components/add-product/add-product.component';
import { ViewProductsComponent } from './admin/components/view-products/view-products.component';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentComponent } from './admin/components/payment/payment.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UsuariosComponent,
    ProductosComponent,
    VentasComponent,
    LoginComponent,
    AddUserComponent,
    ViewUsersComponent,
    AddProductComponent,
    ViewProductsComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    MatIconModule,
    HttpClientModule,
    NgxStripeModule.forRoot()
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    UsersService,
    AuthGuardService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
