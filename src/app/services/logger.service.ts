import { Injectable } from '@angular/core';
import { environment } from '../../environments/environtments';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(...args: any[]): void {
    if (environment.logging) console.log('[LOG]', ...args);
  }

  info(...args: any[]): void {
    if (environment.logging) console.info('[INFO]', ...args);
  }

  warn(...args: any[]): void {
    if (environment.logging) console.warn('[WARN]', ...args);
  }

  error(...args: any[]): void {
    if (environment.logging) console.error('[ERROR]', ...args);
  }

  debug(...args: any[]): void {
    if (environment.logging) console.debug('[DEBUG]', ...args);
  }

  success(...args: any[]): void {
    if (environment.logging) console.log('%c[SUCCESS]', 'color: green', ...args);
  }
}
