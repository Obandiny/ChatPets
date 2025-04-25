import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
  
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      raza: ['', [Validators.required]],
      peso: ['', [Validators.required, Validators.min(0)]],
      altura: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.registroForm.value) {
      localStorage.setItem('mascota', JSON.stringify(this.registroForm.value));
      // console.log('Formulario válido', this.registroForm.value);
      this.router.navigate(['/diagnostico']);
    } 
  }

}
