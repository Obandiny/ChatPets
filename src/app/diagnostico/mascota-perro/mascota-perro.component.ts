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
import { MascotaService } from '../../services/mascota.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { LoggerService } from '../../services/logger.service';
import { MatDividerModule } from '@angular/material/divider';
 
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
    MatDividerModule
  ],
  templateUrl: './mascota-perro.component.html',
  styleUrls: ['./mascota-perro.component.css']
})
export class MascotaPerroComponent {
  isMenuOpen = false;
  mostrarResumen = false;
  mascotaSeleccionada: any;

  questions = [
    '¿Qué síntomas ha presentado tu mascota y desde cuándo los notaste?',
    '¿La condición de tu mascota ha empeorado, mejorado o se ha mantenido igual?',
    '¿Cómo ha sido el apetito y el consumo de agua de tu mascota en los últimos días?',
    '¿Tu mascota ha tenido cambios en el comportamiento?',
    '¿Has notado secreciones o cambios en su pelaje o piel?',
    '¿Cómo han sido sus heces y orina recientemente?',
    '¿Ha vomitado? ¿Con qué frecuencia y qué tipo de contenido?',
    '¿Tu mascota tiene antecedentes médicos importantes o enfermedades crónicas?',
    '¿Está al día con sus vacunas y desparasitaciones?',
    '¿Está tomando actualmente algún medicamento o suplemento?',
    '¿Ha estado en contacto con otros animales recientemente?',
    '¿Ha salido de viaje o ha estado en un lugar diferente al habitual?',
    '¿Ha mostrado dificultades para moverse o signos de dolor físico?'
  ];

  answers: string[] = Array(this.questions.length).fill('');

  currentQuestionIndex = 0;

  constructor(
    private diagnosticoService: DiagnosticoService,
    private mensajeService: MensajeService,
    private router: Router,
    private routerActivate: ActivatedRoute,
    private mascotaService: MascotaService,
    private logger: LoggerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.routerActivate.queryParams.subscribe(param => {
      const mascotaId = param['id'];
      if (mascotaId) {
        this.mascotaService.getMascotaById(mascotaId).subscribe(
            data => {
            this.mascotaSeleccionada = data;

            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('mascota_id', mascotaId);
            }
          },
          error => {
            console.error('Error', error);
          }
        );
      }
    });
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
    if (!isPlatformBrowser(this.platformId)) return;

    const mascotaId = parseInt(localStorage.getItem('mascota_id') || '0');
    if (!mascotaId) {
      this.logger.error('ID de mascota no encontrado en localstorage');
      return;
    }

    this.logger.info('Enviando respuestas:', this.answers);

    this.diagnosticoService.enviarDiagnostico(this.answers, mascotaId)
      .subscribe({
        next: (res: any) => {
          this.mensajeService.setMensajes([
            { text: this.answers.map((q, i) => `Q${i + 1}: ${this.questions[i]}\nA: ${q}`).join('\n\n'), isBot: false },
            { text: res.resultado?.respuesta || 'Diagnóstico generado', isBot: true }
          ]);
          this.router.navigate(['/chatbot']);
        },
        error: (err) => {
          console.error('Error al enviar diagnostico:', err);
        }
      });
  }

  mostrarResumenFinal(): void {
    this.mostrarResumen = true;
  }

  editarRespuestas(): void {
    this.mostrarResumen = false;
    this.currentQuestionIndex = 0;
  }
}
