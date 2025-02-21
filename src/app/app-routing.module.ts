import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UsuariosComponent } from './admin/pages/usuarios/usuarios.component';
import { ProductosComponent } from './admin/pages/productos/productos.component';
import { VentasComponent } from './admin/pages/ventas/ventas.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'usuarios', component:UsuariosComponent, canActivate: [AuthGuardService],    data: { roles: ['admin'] }},
  {path: 'productos', component:ProductosComponent, canActivate: [AuthGuardService],    data: { roles: ['admin', 'root'] }},
  {path: 'ventas', component:VentasComponent, canActivate: [AuthGuardService],    data: { roles: ['admin'] }},
  { path: 'login', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
