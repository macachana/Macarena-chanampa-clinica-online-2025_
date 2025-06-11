import { Component, inject } from '@angular/core';

import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Administrador } from '../../clases/administrador';
import { Especialista } from '../../clases/especialista';
import { Paciente } from '../../clases/paciente';

@Component({
  selector: 'app-mi-perfil',
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})

export class MiPerfilComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  listaAdministradores : Administrador[] = [];
  listaEspecialistas : Especialista[] = [];
  listaPacientes : Paciente[] = [];

  constructor()
  {
    this.db.listarAdministrador().then((administradores: Administrador[])=>{
      this.listaAdministradores = administradores;
      console.log("lista de administradores");
      console.log(this.listaAdministradores);
    });

    this.db.listarEspecialistas().then((especialistas: Especialista[])=>{
      this.listaEspecialistas = especialistas;
      console.log("lista de especialistas");
      console.log(this.listaEspecialistas);
    });

    this.db.listarPacientes().then((pacientes: Paciente[])=>{
      this.listaPacientes = pacientes;
      console.log("lista de pacientes");
      console.log(this.listaPacientes);
    });
  }
}
