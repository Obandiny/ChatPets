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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
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
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './mascota-perro.component.html',
  styleUrls: ['./mascota-perro.component.css']
})
export class MascotaPerroComponent {
  isMenuOpen = false;
  mostrarResumen = false;
  modalAbierto = false;
  mostrarFaseOverlay = true;
  editandoMascota = false;
  datosEditables: any = {};
  mascotaSeleccionada: any;

  fases = [
    {
      titulo: 'Fase 1: Síntomas generales',
      preguntas: [
        '¿Qué síntomas ha presentado tu mascota y desde cuándo los notaste?',
        '¿La condición de tu mascota ha empeorado, mejorado o se ha mantenido igual?',
        '¿Cómo ha sido el apetito y el consumo de agua de tu mascota en los últimos días?'
      ]
    },
    {
      titulo: 'Fase 2: Observaciones físicas y comportamiento',
      preguntas: [
        '¿Tu mascota ha tenido cambios en el comportamiento?',
        '¿Has notado secreciones o cambios en su pelaje o piel?',
        '¿Cómo han sido sus heces y orina recientemente?',
        '¿Ha vomitado? ¿Con qué frecuencia y qué tipo de contenido?',
        '¿Ha mostrado dificultades para moverse o signos de dolor físico?'
      ]
    },
    {
      titulo: 'Fase 3: Historial y entorno',
      preguntas: [
        '¿Tu mascota tiene antecedentes médicos importantes o enfermedades crónicas?',
        '¿Está al día con sus vacunas y desparasitaciones?',
        '¿Está tomando actualmente algún medicamento o suplemento?',
        '¿Ha estado en contacto con otros animales recientemente?',
        '¿Ha salido de viaje o ha estado en un lugar diferente al habitual?'
      ]
    }
  ];

  faseActual = 0;
  preguntaActual = 0;
  answers: string[][] = [[], [], []];

  currentQuestionIndex = 0;

  constructor(
    private diagnosticoService: DiagnosticoService,
    private mensajeService: MensajeService,
    private router: Router,
    private routerActivate: ActivatedRoute,
    private mascotaService: MascotaService,
    private logger: LoggerService,
    private snackBar: MatSnackBar,
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

    setTimeout(() => this.mostrarFaseOverlay = false, 2000);
  }

  get preguntasFase(): string[] {
    return this.fases[this.faseActual].preguntas;
  }

  get preguntaActualTexto(): string {
    return this.preguntasFase[this.preguntaActual];
  }

  get currentAnswer(): string {
    return this.answers[this.faseActual][this.preguntaActual] || '';
  }

  set currentAnswer(value: string) {
    this.answers[this.faseActual][this.preguntaActual] = value;
  }

  before(): void {
    if (this.preguntaActual > 0) {
      this.preguntaActual--;
    } else if (this.faseActual > 0) {
      this.faseActual--;
      this.preguntaActual = this.preguntasFase.length - 1;
      this.mostrarFaseTemporal();
    }
  }

  next(): void {
    const respuesta = this.currentAnswer?.trim();
    if (respuesta !== '') {
      if (this.preguntaActual < this.preguntasFase.length - 1) {
        this.preguntaActual++;
      } else if (this.faseActual < this.fases.length - 1) {
        this.faseActual++;
        this.preguntaActual = 0;
        this.mostrarFaseTemporal();
      } else {
        this.mostrarResumenFinal();
      }
    }
  }

  isFirstQuestion(): boolean {
    return this.faseActual === 0 && this.preguntaActual === 0;
  }

  isAnswerEmpty(): boolean {
    return this.currentAnswer.trim() === '';
  }

  getInputType(index: number): string {
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

    const respuestasPlanas = this.answers.flat();

    this.logger.info('Enviando respuestas:', respuestasPlanas);

    this.diagnosticoService.enviarDiagnostico(respuestasPlanas, mascotaId)
      .subscribe({
        next: (res: any) => {
          this.mensajeService.setMensajes([
            { text: respuestasPlanas.map((q, i) => `Q${i + 1}: ${q}`).join('\n\n'), isBot: false },
            { text: res.resultado?.respuesta || 'Diagnóstico generado', isBot: true }
          ]);
          this.router.navigate(['/menu']);
        },
        error: (err) => {
          console.error('Error al enviar diagnostico:', err);
        }
      });
  }

  activarEdicion() {
    this.editandoMascota = true;
    this.datosEditables = { ...this.mascotaSeleccionada };
  }

  guardarCambiosMascota() {
    const seguimiento = {
      mascota_id: this.datosEditables.id,
      nombre: this.datosEditables.nombre,
      edad: this.datosEditables.edad,
      raza: this.datosEditables.raza,
      peso: this.datosEditables.peso
    };

    this.mascotaService.guardarSeguimiento(seguimiento).subscribe({
      next: () => {
        this.editandoMascota = false;
        this.mascotaSeleccionada = { ...this.datosEditables };

        this.snackBar.open('✅ Cambios guardados correctamente', 'cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: err => {
        this.logger.error('Error al guardar seguimiento.', err);

        this.snackBar.open('❌ Error al guardar los cambios', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  mostrarResumenFinal(): void {
    this.mostrarResumen = true;
  }

  editarRespuestas(): void {
    this.mostrarResumen = false;
    this.faseActual = 0;
    this.preguntaActual = 0;
  }

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  mostrarFaseTemporal(): void {
    this.mostrarFaseOverlay = true;
    setTimeout(() => this.mostrarFaseOverlay = false, 2000);
  }
}
