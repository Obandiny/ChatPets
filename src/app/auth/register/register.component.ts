import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      raza: ['', [Validators.required, Validators.email]],
      peso: ['', [Validators.required, Validators.minLength(6)]],
      altura: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      console.log('Formulario válido', this.registroForm.value);
      // Procesar el formulario aquí
    } else {
      console.log('Formulario inválido');
    }
  }

}
