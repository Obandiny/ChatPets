import { Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ConfiguracionComponent } from './Configuracion/configuracion.component';
import { EleccionComponent } from './eleccion/eleccion.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';


export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'diagnostico', component: ConfiguracionComponent },
    { path: 'eleccion', component: EleccionComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent }
];
