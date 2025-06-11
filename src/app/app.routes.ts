import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { EncuestaComponent } from './pages/encuesta/encuesta.component';

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
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'registros',
        loadChildren:() => import('./pages/registro/registro.routes').then((archivo)=> archivo.routes)
    },
    {
        path: 'mi_perfil',
        component: MiPerfilComponent
    },
    {
        path: 'mis_turnos',
        component: MisTurnosComponent
    },
    {
        path: 'solicitar_turno',
        component: SolicitarTurnoComponent
    },
    {
        path: 'turnos',
        component: TurnosComponent
    },
    {
        path: 'usuarios',
        component: UsuariosComponent
    },
    {
        path: 'encuesta',
        component: EncuestaComponent
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
