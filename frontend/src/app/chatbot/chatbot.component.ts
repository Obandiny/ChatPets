import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
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
export class ChatbotComponent implements OnInit {

  diagnosticos: any[] = [];
  columnas = ['mascota', 'enfermedad', 'prioridad', 'fecha', 'acciones'];
  
  constructor(
    public chatbotService: ChatbotService,
    private mensajeServie: MensajeService,
    private diagnosticoService: DiagnosticoService,
    private logger: LoggerService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDiagnosticos();
  }

  cargarDiagnosticos() {
    this.diagnosticoService.getHistorial()
      .subscribe(res => this.diagnosticos = res);
  }

  verDetalle(id: number) {
    this.router.navigate(['/diagnostico-detalle', id]);
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar diagnostico?')) {
      this.diagnosticoService.elimiarHistorial(id).subscribe(() => {
        this.cargarDiagnosticos();
      });
    }
  }

  // formatBotMessage(text: string): string {
  //   let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  //   formatted = formatted.replace(/\n/g, '<br>');
  //   formatted = formatted.replace(/(\d+)\.\s+/g, '<br><strong>$1.</strong> ');
  //   formatted = formatted.replace(/•\s+/g, '<br>• ');
  //   formatted = formatted.replace(/(Recomendaciones para el dueño:)/g, '<u><strong>$1</strong></u>');
  //   formatted = formatted.replace(
  //     /(https:\/\/wa\.me\/[0-9]+(\?text=[^\s]*)?)/g,
  //     '<a href="$1" target="_blank" style="color: #2ea44f; text-decoration: underline;">$1</a>'
  //   );
  //   return formatted;
  // }
}
