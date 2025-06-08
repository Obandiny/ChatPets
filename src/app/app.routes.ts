import { Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ConfiguracionComponent } from './Configuracion/configuracion.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guard/auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'diagnostico', component: ConfiguracionComponent },
    { 
        path: 'menu', 
        component: MenuComponent,
        // canActivate: [authGuard] 
    },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent }
];
