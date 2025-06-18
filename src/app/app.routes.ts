import { Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guard/auth.guard';
import { MascotaPerroComponent } from './diagnostico/mascota-perro/mascota-perro.component';
import { RegistarMascotaComponent } from './registar-mascota/registar-mascota.component';


export const routes: Routes = [
    { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'diagnostico/mascota-perro', component: MascotaPerroComponent },
    { 
        path: 'menu', 
        component: MenuComponent,
        canActivate: [authGuard] 
    },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'registrar-mascota', component: RegistarMascotaComponent }
];
