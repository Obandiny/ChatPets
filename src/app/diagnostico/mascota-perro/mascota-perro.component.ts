import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MensajeService } from '../../services/mensaje.service';
 
@Component({
  selector: 'app-mascota-perro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './mascota-perro.component.html',
  styleUrls: ['./mascota-perro.component.css']
})
export class MascotaPerroComponent {
  isMenuOpen = false;

  questions = [
    '¿Cuál es el síntoma principal que presenta tu mascota?',
    '¿Desde hace cuánto presenta ese síntoma?',
    '¿Ha tenido cambios en el apetito o comportamiento?',
    '¿Tu mascota ha tenido fiebre o vómitos recientemente?',
    '¿Ha estado en contacto con otros animales últimamente?'
  ];

  answers: string[] = Array(this.questions.length).fill('');

  currentQuestionIndex = 0;

  constructor(
    private diagnosticoService: DiagnosticoService,
    private mensajeService: MensajeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  get currentAnswer(): string {
    return this.answers[this.currentQuestionIndex];
  }

  set currentAnswer(value: string) {
    this.answers[this.currentQuestionIndex] = value;
  }

  before(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  next(): void {
    const respuesta = this.answers[this.currentQuestionIndex]?.trim();
    if (respuesta !== '') {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        // this.finishDiagnosis();
      }
    }
  }

  isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 0;
  }

  isAnswerEmpty(): boolean {
    return this.answers[this.currentQuestionIndex]?.trim() === '';
  }

  getInputType(index: number): string {
    if (index === 1) {
      return 'number';
    }
    return 'text';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  finishDiagnosis(): void {
    const mascotaId = parseInt(localStorage.getItem('mascota_id') || '0');
    if (!mascotaId) {
      console.error('ID de mascota no encontrado en localstorage');
      return;
    }

    this.diagnosticoService.enviarDiagnostico(this.answers, mascotaId)
      .subscribe({
        next: (res: any) => {
          this.mensajeService.setMensajes([
            { text: this.answers.join('\n'), isBot: false },
            { text: res.respuesta, isBot: true }
          ]);
          this.router.navigate(['/chatbot']);
        },
        error: (err) => {
          console.error('Error al enviar diagnostico:', err);
        }
      });
  }
}
