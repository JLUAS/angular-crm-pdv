import { Component } from '@angular/core';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  isMobileMenuOpen = false;

  constructor(private usersService:UsersService){}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(){
    this.usersService.logout()
  }
}
