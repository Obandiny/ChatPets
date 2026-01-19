import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarComponent {

  archivoSeleccionado: File | null = null;
  cargando: boolean = false;

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar,
    private logger: LoggerService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();

    if (!['xlsx', 'xls'].includes(extension)) {
      this.snack.open('Formato invalido. Solo se permiten archivos .xlsx o .xls', 'Cerrar', {
        duration: 3000,
        panelClass: ['toast-error']
      });
      return;
    }

    this.archivoSeleccionado = file;
  }

  subirArchivo() {
    if (!this.archivoSeleccionado) {
      this.snack.open('Por favor selecciona un archivo', 'OK', {
        duration: 3000
      });
      return;
    }

    this.cargando = true;

    const formData = new FormData();
    formData.append('file', this.archivoSeleccionado);

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });

    this.http.post('http://localhost:5000/api/modelo/importar', formData, { headers })
      .subscribe({
        next: () => {
          this.cargando = false;
          this.snack.open('Datos importados y modelo entrenado correctamente.', 'OK', {
            duration: 3500,
            panelClass: ['toast-success']
          });
          this.archivoSeleccionado = null;
        },
        error: (err) => {
          this.logger.error('Error al subir archivo:', err);
          this.cargando = false;

          const msg = err?.error?.error ?? 'Error desconocido';

          this.snack.open('Error: ' + msg, 'Cerrar', {
            duration: 3500,
            panelClass: ['toast-error']
          });
        }
      });
  }
}
