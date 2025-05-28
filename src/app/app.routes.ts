import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ErrorComponent } from './pages/error/error.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'inicio',
        component: InicioComponent,
        title: 'Inicio'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path: 'error',
        component: ErrorComponent,
        title: 'Error'
    },
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'error',
        pathMatch: 'full'
    }
];
