import { Component, ElementRef, ViewChild } from '@angular/core';
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


interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-mascota-perro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    // RouterLink,
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

  @ViewChild('chatWindow') chatWindow!: ElementRef;

  mascotaSeleccionada: any;

  messages: ChatMessage[] = [];
  currentAnswer: string = '';
  isTyping = false;

  faseIndex = 0;
  preguntaIndex = 0;

  respuestas: {
    fase: string;
    pregunta: string;
    respuesta: string;
  }[] = [];

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

      if (param['mascota']) {
        this.mascotaSeleccionada = JSON.parse(param['mascota']);
        this.mostrarMensajeInicial();
        return;
      }

      if (param['id']) {
        this.mascotaService.getMascotaById(param['id']).subscribe(m => {
          this.mascotaSeleccionada = m;
          this.mostrarMensajeInicial();
        });
      }

    });
  }

  mostrarMensajeInicial() {
    const mascota = this.mascotaSeleccionada;

    this.pushBotMessage(
      `Vamos a iniciar el diagnostico de tu mascota
      
      Nombre: ${mascota.nombre}
      Raza: ${mascota.raza}
      Edad: ${mascota.edad} años
      Peso: ${mascota.peso} Kg
      
      Te hare algunas preguntas para entender mejor su estado de salud.`
    );

    setTimeout(() => {
      this.enviarPreguntaActual();
    }, 800);
  }

  enviarPreguntaActual() {
    const fase = this.fases[this.faseIndex];
    const pregunta = fase.preguntas[this.preguntaIndex];

    this.pushBotMessage(`(${fase.titulo})\n${pregunta}`);
  }

  avanzarPregunta() {
    this.preguntaIndex++;

    if (this.preguntaIndex < this.fases[this.faseIndex].preguntas.length) {
      this.enviarPreguntaActual();
      return;
    }

    this.faseIndex++;
    this.preguntaIndex = 0;

    if (this.faseIndex < this.fases.length) {
      this.pushBotMessage(`Pasemos a la siguiente seccion`);
      setTimeout(() => this.enviarPreguntaActual(), 700);
    } else {
      this.finishDiagnosis();
    }
  }

  guardarRespuesta(respuesta: string) {
    const fase = this.fases[this.faseIndex];
    const pregunta = fase.preguntas[this.preguntaIndex];

    this.respuestas.push({
      fase: fase.titulo,
      pregunta,
      respuesta
    });
  }

  sendMessage() {
    const texto = this.currentAnswer.trim();
    if (!texto) return;

    this.messages.push({ from: 'user', text: texto });

    this.guardarRespuesta(texto);

    this.currentAnswer = '';

    this.avanzarPregunta();

    this.scrollToBottom();
  }

  finishDiagnosis() {
    this.pushBotMessage('Gracias. Estoy analizando la informacion...');

    const sintomas: string[] = this.respuestas.map(r =>
      `${r.pregunta} - ${r.respuesta}`
    );

    const mascotaId = this.mascotaSeleccionada.id;

    this.diagnosticoService.enviarDiagnostico(sintomas, mascotaId)
      .subscribe({
        next: (res) => {
          this.pushBotMessage(res.recomendacion || 'Diagnostico generado correctamente.');
        },
        error: (err) => {
          this.logger.error(err);
          this.pushBotMessage('Ocurrio un error al generar el diagnostico.');
        }
      });
  }

  pushBotMessage(text: string) {
    this.isTyping = true;

    setTimeout(() => {
      this.messages = [...this.messages, { from: 'bot', text}];
      this.isTyping = false;

      this.scrollToBottom();
    }, 300);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatWindow) {
        this.chatWindow.nativeElement.scrollTop =
          this.chatWindow.nativeElement.scrollHeight;
      }
    }, 100);
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  // guardarCambiosMascota() {
  //   const seguimiento = {
  //     mascota_id: this.datosEditables.id,
  //     nombre: this.datosEditables.nombre,
  //     edad: this.datosEditables.edad,
  //     raza: this.datosEditables.raza,
  //     peso: this.datosEditables.peso
  //   };

  //   this.mascotaService.guardarSeguimiento(seguimiento).subscribe({
  //     next: () => {
  //       this.editandoMascota = false;
  //       this.mascotaSeleccionada = { ...this.datosEditables };

  //       this.snackBar.open('✅ Cambios guardados correctamente', 'cerrar', {
  //         duration: 3000,
  //         panelClass: ['snackbar-success']
  //       });
  //     },
  //     error: err => {
  //       this.logger.error('Error al guardar seguimiento.', err);

  //       this.snackBar.open('❌ Error al guardar los cambios', 'Cerrar', {
  //         duration: 3000,
  //         panelClass: ['snackbar-error']
  //       });
  //     }
  //   });
  // }

}
