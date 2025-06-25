import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { LoggerService } from '../../services/logger.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-table-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './table-usuarios.component.html',
  styleUrls: ['./table-usuarios.component.css']
})
export class TableUsuariosComponent {
  usuarios: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'correo', 'rol', 'acciones'];

  constructor (
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.logger.info('Usuarios cargados:', data);
      },
      error: (err) => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        this.logger.error('Error en cargar los usuarios.', err);
      } 
    });
  }

  cambiarRol(user: { id: number, rol: string }) {
    const nuevoRol = user.rol === 'admin' ? 'usuario' : 'admin';
    this.usuariosService.actualizarRolUsuario(user.id, nuevoRol).subscribe({
      next: () => {
        user.rol = nuevoRol;
        this.snackBar.open('Rol actualizado', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Error al cambiar rol', 'Cerrar', { duration: 3000 });
        this.logger.error('Error en cambiar rol.', err);
      }
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
        this.logger.error('Error en eliminar el usuario.', err);
      }
    });
  }
}
