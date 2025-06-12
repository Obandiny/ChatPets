import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoggerService } from '../../services/logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
    
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', Validators.required, Validators.email],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private logger: LoggerService,
    private snackbar: MatSnackBar,
    private matInput: MatInputModule
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.snackbar.open('Por favor completa todos los campos correctamente.', 'Cerrar', { duration: 3000 });
      this.logger.warn('Formulario inválido al registrar usuario', this.form.value);
      this.form.markAllAsTouched();
      return;
    }
      this.auth.register(this.form.value).subscribe({
        next: res => {
          this.snackbar.open('Registro exitoso. Revisa tu correo para verificar tu cuenta.', 'Cerrar', { duration: 3000 });
          this.logger.info('Usuario registrado con éxito', this.form.value);
          this.router.navigate(['/auth/login']);
        },
        error: err => {
          const mensaje = err.error?.message || 'Error en el registro';
          this.snackbar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.logger.error('Error al registrar usuario', err);
        }
        
      });
  }
}