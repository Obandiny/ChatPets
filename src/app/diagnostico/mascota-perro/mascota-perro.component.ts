import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-perro',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mascota-perro.component.html',
  styleUrl: './mascota-perro.component.css'
})
export class MascotaPerroComponent {

  preguntas_diagnostico = [
    'Aqui las preguntas del diagnostico completo para perros.'
  ];

  respuestas: string[] = Array(this.preguntas_diagnostico.length).fill('');

  currentQuestionIndex = 0;

  constructor(private mascotaService: MascotaService) {}

}
