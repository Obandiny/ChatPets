import { Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { InformacionComponent } from './informacion/informacion.component';
import { ConfiguracionComponent } from './Configuracion/configuracion.component';
import { EleccionComponent } from './eleccion/eleccion.component';


export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'informacion', component: InformacionComponent },
    { path: 'diagnostico', component: ConfiguracionComponent },
    { path: 'eleccion', component: EleccionComponent }
];
