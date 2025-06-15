import { Routes } from "@angular/router";
import { RegistroEspecialistaComponent } from "../registro-especialista/registro-especialista.component";
import { RegistroPacienteComponent } from "../registro-paciente/registro-paciente.component";
import { RegistroAdministradorComponent } from "../registro-administrador/registro-administrador.component";

const routes: Routes = [
    {
        path: 'registro-especialista',
        component: RegistroEspecialistaComponent,
        title: 'Registro de especialistas'
    },
    {
        path: 'registro-paciente',
        component: RegistroPacienteComponent,
        title: 'Registro de pacientes'
    },
    {
        path: 'registro-administrador',
        component: RegistroAdministradorComponent,
        title: 'Registro de administrador'
    }
];

export { routes };