import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotaService } from '../services/mascota.service';

@Component({
  selector: 'app-registar-mascota',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './registar-mascota.component.html',
  styleUrl: './registar-mascota.component.css'
})
export class RegistarMascotaComponent {
  mascotaForm: FormGroup;

  constructor(private fb: FormBuilder, private mascotaService: MascotaService) {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      raza: ['', Validators.required],
      edad: ['', Validators.required],
      peso: ['', Validators.required],
      tamano: ['', Validators.required]
    });
  }

  registrarMascota() {
    if (this.mascotaForm.valid) {
      this.mascotaService.registrarMascota(this.mascotaForm.value).subscribe({
        next: (res: any) => {
          alert('Mascota registrada correctamente');
          this.mascotaForm.reset();
        },
        error: (err: any) => {
          alert('Error al registrar mascota');
          console.error(err);
        }
      });
    }
  }
}
