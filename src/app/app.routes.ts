import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { InformacionComponent } from './informacion/informacion.component';
import { ConfiguracionComponent } from './Configuracion/configuracion.component';


export const routes: Routes = [
    { path: '', redirectTo: 'auth/register', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'informacion', component: InformacionComponent },
    { path: 'diagnostico', component: ConfiguracionComponent },
];
