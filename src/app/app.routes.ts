import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ErrorComponent } from './pages/error/error.component';
import { RegistroEspecialistaComponent } from './pages/registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from './pages/registro-paciente/registro-paciente.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroAdministradorComponent } from './pages/registro-administrador/registro-administrador.component';

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
        path: 'registro-especialista',
        component: RegistroEspecialistaComponent
    },
    {
        path: 'registro-paciente',
        component: RegistroPacienteComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'registro-administrador',
        component: RegistroAdministradorComponent
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
