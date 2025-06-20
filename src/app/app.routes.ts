import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { EncuestaComponent } from './pages/encuesta/encuesta.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { HistorialClinicoComponent } from './pages/historial-clinico/historial-clinico.component';
import { InformesComponent } from './pages/informes/informes.component';

export const routes: Routes = [
    {
        path: 'inicio',
        component: InicioComponent,
        title: 'Inicio'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Inicio de sesión'
    },
    {
        path: 'registro',
        component: RegistroComponent,
        title: 'Registro',
        data: {animation: 'seleccionRegistro'}
    },
    {
        path: 'registros',
        loadChildren:() => import('./pages/registro/registro.routes').then((archivo)=> archivo.routes)
    },
    {
        path: 'mi_perfil',
        component: MiPerfilComponent,
        title: 'Mi perfil'
    },
    {
        path: 'mis_turnos',
        component: MisTurnosComponent,
        title: 'Mis turnos'
    },
    {
        path: 'solicitar_turno',
        component: SolicitarTurnoComponent,
        title: 'Solicitar turno'
    },
    {
        path: 'turnos',
        component: TurnosComponent,
        title: 'Lista de turnos'
    },
    {
        path: 'usuarios',
        component: UsuariosComponent,
        title: 'Lista de usuarios'
    },
    {
        path: 'encuesta',
        component: EncuestaComponent,
        title: 'Encuesta'
    },
    {
        path: 'pacientes',
        component: PacientesComponent,
        title: 'Lista de pacientes'
    },
    {
        path: 'historial_clinico',
        component: HistorialClinicoComponent,
        title: 'Historial clínico'
    },
    {
        path: 'informes',
        component: InformesComponent,
        title: 'Informes'
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
