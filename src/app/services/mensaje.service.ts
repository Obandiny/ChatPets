import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private mensajes: { text: string, isBot: boolean }[] = [];

  setMensajes(nuevos: { text: string, isBot: boolean }[]) {
    this.mensajes = nuevos;
  }

  getMensajes() {
    return this.mensajes;
  }

  limpiar() {
    this.mensajes = [];
  }
}
