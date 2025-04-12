import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { InformacionComponent } from './informacion/informacion.component';
import { ConfiguracionComponent } from './Configuracion/configuracion.component';


export const routes: Routes = [
    { path: '', redirectTo: 'auth/register', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'auth/login', component: LoginComponent},
    { path: 'auth/register', component: RegisterComponent },
    { path: 'informacion', component: InformacionComponent },
    { path: 'diagnostico', component: ConfiguracionComponent },
];
