import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  esAdmin: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.checkIfAdmin();
  }

  checkIfAdmin() {
    const role = localStorage.getItem('rolUsuario');
    this.esAdmin = role === 'admin';
  }

  toggleMenu() {
    // lógica de apertura/cierre del menú
  }

  logout() {
    // lógica de cierre de sesión
  }
}
