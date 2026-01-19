import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { LoggerService } from '../../services/logger.service';
import { UsuariosService } from '../../services/admin/usuarios.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

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
    MatDividerModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './table-usuarios.component.html',
  styleUrls: ['./table-usuarios.component.css']
})
export class TableUsuariosComponent {
  usuarios: any[] = [];
  isMobile = false;
  originalUsuarios: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'correo', 'rol', 'acciones'];

  constructor (
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
    private usuariosService: UsuariosService,
    @Inject(PLATFORM_ID) private platfomrId: Object
  ) {}

  ngOnInit() {
    this.cargarUsuarios();

    if (isPlatformBrowser(this.platfomrId)) {
      this.isMobile = window.innerWidth < 768;
    }
    this.displayedColumns = this.isMobile
      ? ['nombre', 'correo', 'accionesMenu']
      : ['id', 'nombre', 'apellido', 'correo', 'rol', 'acciones'];
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.originalUsuarios = data;
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

  filtrarDesdeEvento(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.filtrarUsuarios(input.value);
  }

  filtrarUsuarios(valor: string) {
    const query = valor.toLowerCase();
    this.usuarios = this.originalUsuarios.filter(user =>
      user.nombre.toLowerCase().includes(query) ||
      user.apellido.toLowerCase().includes(query) ||
      user.correo.toLowerCase().includes(query) ||
      user.rol.toLowerCase().includes(query)
    );
  }
}
