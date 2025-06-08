import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule
    
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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.valid) {}
      this.auth.register(this.form.value).subscribe({
        next: res => {
          alert('Registro exitosos. Revisa tu correo para verificar tu cuenta.');
          this.router.navigate(['/auth/login']);
        },
        error: err => alert(err.error?.message || 'Error en el registro' )
      });
  }
}