import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, 
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private snackbar: MatSnackBar,
    private logger: LoggerService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackbar.open('Por favor completa los campos correctamente.', 'Cerrar', { duration: 3000 });
      this.logger.warn('Formulario de login inválido', this.loginForm.value);
      return;
    };

    this.auth.login(this.loginForm.value).subscribe({
      next: res => {
        this.auth.saveToken(res.token);
        const rol = this.auth.getRole();

        this.snackbar.open(`Bienvenido, ${rol}`, 'Cerrar', { duration: 3000 });
        this.logger.info('Inicio de sesión exitoso', { correo: this.loginForm.value.correo, rol });
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Credenciales inválidas';
        this.snackbar.open(mensaje, 'Cerrar', { duration: 3000 });
        this.logger.error('Error al iniciar sesión', err);
      }
    });
  }
}
