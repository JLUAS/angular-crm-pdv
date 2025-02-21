import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private userService: UsersService ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const allowedRoles: string[] = route.data['roles'];

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes estar autenticado');
            return this.router.parseUrl('/login');
        }

        const userRole = localStorage.getItem('rol');

        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole || '')) {
            alert('No tienes permisos para acceder a esta ruta');
            return this.router.parseUrl('/login');
        }
        return true;
    }
}
