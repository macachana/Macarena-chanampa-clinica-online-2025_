import { Routes } from "@angular/router";
import { RegistroEspecialistaComponent } from "../registro-especialista/registro-especialista.component";
import { RegistroPacienteComponent } from "../registro-paciente/registro-paciente.component";
import { RegistroAdministradorComponent } from "../registro-administrador/registro-administrador.component";

const routes: Routes = [
    {
        path: 'registro-especialista',
        component: RegistroEspecialistaComponent
    },
    {
        path: 'registro-paciente',
        component: RegistroPacienteComponent
    },
    {
        path: 'registro-administrador',
        component: RegistroAdministradorComponent
    }
];

export { routes };