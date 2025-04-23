import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { InformacionComponent } from './informacion/informacion.component';
import { ConfiguracionComponent } from './Configuracion/configuracion.component';
import { InicioComponent } from './inicio/inicio.component';
import { EleccionComponent } from './eleccion/eleccion.component';


export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'informacion', component: InformacionComponent },
    { path: 'diagnostico', component: ConfiguracionComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'eleccion', component: EleccionComponent }
];
