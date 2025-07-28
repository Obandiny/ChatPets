import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MensajeService } from '../services/mensaje.service';
import { DiagnosticoService } from '../services/diagnostico.service';
import { LoggerService } from '../services/logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  diagnosticos: any[] = [];
  columnas: string[] = ['fecha', 'sintomas', 'recomendacion', 'alerta', 'acciones'];
  detalleActual: any = null;

  constructor(
    public chatbotService: ChatbotService,
    private mensajeServie: MensajeService,
    private diagnosticoService: DiagnosticoService,
    private logger: LoggerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.cargarDiagnosticos();
  }

  // cargarDiagnosticos() {
  //   this.diagnosticoService.getDiagnosticos().subscribe({
  //     next: data => {
  //       this.diagnosticos = data;
  //     },
  //     error: err => {
  //       this.logger.error('Error al cargar diagnósticos', err);
  //       this.snackBar.open('Error al cargar los diagnósticos', 'Cerrar', { duration: 3000 });
  //     }
  //   });
  // }

  // eliminarDiagnostico(id: number): void {
  //   if (!confirm('¿Estás seguro de eliminar este diagnóstico?')) return;

  //   this.diagnosticoService.deleteDiagnostico(id).subscribe({
  //     next: () => {
  //       this.snackBar.open('Diagnóstico eliminado', 'Cerrar', { duration: 2000 });
  //       this.cargarDiagnosticos(); // refrescar tabla
  //     },
  //     error: err => {
  //       this.logger.error('Error al eliminar diagnóstico', err);
  //       this.snackBar.open('Error al eliminar diagnóstico', 'Cerrar', { duration: 3000 });
  //     }
  //   });
  // }

  getPrioridadClass(prioridad: string): string {
    switch (prioridad?.toLowerCase()) {
      case 'grave':
        return 'alerta-grave';
      case 'media':
        return 'alerta-media';
      case 'baja':
        return 'alerta-baja';
      default:
        return 'alerta-default';
    }
  }

  formatBotMessage(text: string): string {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/(\d+)\.\s+/g, '<br><strong>$1.</strong> ');
    formatted = formatted.replace(/•\s+/g, '<br>• ');
    formatted = formatted.replace(/(Recomendaciones para el dueño:)/g, '<u><strong>$1</strong></u>');
    formatted = formatted.replace(
      /(https:\/\/wa\.me\/[0-9]+(\?text=[^\s]*)?)/g,
      '<a href="$1" target="_blank" style="color: #2ea44f; text-decoration: underline;">$1</a>'
    );
    return formatted;
  }
}
