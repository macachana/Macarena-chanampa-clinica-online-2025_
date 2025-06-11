import { Component, inject } from '@angular/core';

import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';

import { 
  AbstractControl,
  FormControl, 
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

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

  especialidadElegida : string = "";
  idEspecialista : number | undefined = 0;

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

  agregarHorario(dia:string)
  {
    const duracionElegida = (<HTMLSelectElement>document.getElementById("duracionElegida")).value;

    console.log(duracionElegida);
    
    let duracion : number = 0;


    if(duracionElegida == "30 min")
    {
      duracion = 30;
    }
    else if(duracionElegida == "60 min")
    {
      duracion = 60;
    }
    else if(duracionElegida == "90 min")
    {
      duracion = 90;      
    }
    else if(duracionElegida == "120 min")
    {
      duracion = 120;
    }

    for(let i = 0; i < this.listaEspecialistas.length; i++)
    {
      if(this.listaEspecialistas[i].email == this.db.emailUsuarioAct)
      {
        this.especialidadElegida = this.listaEspecialistas[i].especialidad;
        this.idEspecialista = this.listaEspecialistas[i].id;
      }
    }
    
    if(this.idEspecialista)
    {
      this.db.agregarHorario(this.idEspecialista,dia,this.especialidadElegida,duracion);
    }
  }

  cambiarEspecialidadElegida(especialidad: string)
  {
    this.especialidadElegida = especialidad;
  }
}
