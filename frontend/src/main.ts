import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),      // Activa HttpClient con fetch
    provideRouter(routes),                // Rutas configuradas
    importProvidersFrom(FormsModule),    // FormsModule para ngModel
    provideAnimationsAsync('noop')       // Animaciones
  ]
})
.catch(err => console.error(err));
