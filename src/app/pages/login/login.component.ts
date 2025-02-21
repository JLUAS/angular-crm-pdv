import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']  // Si deseas estilos adicionales
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errMessage: string = "";
  isLoading: boolean = false;
  // Variables para el toggle de contraseña
  passwordToggle: string = "password";
  visibility: string = "visibility_off";

  constructor(private fb: FormBuilder, private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePassword(): void {
    if(this.passwordToggle === "password"){
      this.passwordToggle = "text";
      this.visibility = "visibility";
    } else {
      this.passwordToggle = "password";
      this.visibility = "visibility_off";
    }
  }

  login(): void {
    // Limpia mensajes previos
    this.errMessage = "";
    if(this.loginForm.valid) {
      this.isLoading = true;
      const user = this.loginForm.value;  // { email, password }
      this.usersService.login(user).subscribe(
        (res: any) => {
          this.isLoading = false;
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol);
          localStorage.setItem('email', user.email);
          // Redirecciona según el rol recibido
          if(res.rol === "admin") this.router.navigate(['/usuarios']);
          else if(res.rol === "root") this.router.navigate(['/root/usuarios']);
        },
        (err) => {
          this.isLoading = false;
          this.errMessage = 'Error al iniciar sesión';
          console.error(err);
        }
      );
    } else {
      this.errMessage = "Llena todos los campos correctamente";
      // Marca todos los controles como tocados para mostrar mensajes de validación
      this.loginForm.markAllAsTouched();
    }
  }
}
