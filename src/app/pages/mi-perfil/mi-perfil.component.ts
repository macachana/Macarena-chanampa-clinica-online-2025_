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
import Swal from 'sweetalert2';

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
  listaHorarios : any[] = [];

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
      for(let i=0; i < especialistas.length; i++)
      {
        if(especialistas[i].email == this.db.emailUsuarioAct)
        {
          this.especialidadElegida = this.listaEspecialistas[i].especialidad;
          console.log(this.especialidadElegida);
        }
      }
    });

    this.db.listarPacientes().then((pacientes: Paciente[])=>{
      this.listaPacientes = pacientes;
      console.log("lista de pacientes");
      console.log(this.listaPacientes);
    });

    this.db.listarHorarios().then((horarios : any[])=>{
      this.listaHorarios = horarios;
    });

  }

  agregarHorario(dia:string)
  {

    let valor = "";
    const duracionElegida = (<HTMLSelectElement>document.getElementById("duracionElegida"));

    duracionElegida.addEventListener('change', (event) => {
      valor = (event.target as HTMLSelectElement).value;
    })

    let horarioDiaOcupado = false;

    console.log(duracionElegida.value);
    
    let duracion : number = 0;


    if(duracionElegida.value == "30")
    {
      duracion = 30;
    }
    else if(duracionElegida.value == "60")
    {
      duracion = 60;
    }
    else if(duracionElegida.value == "90")
    {
      duracion = 90;      
    }
    else if(duracionElegida.value == "120")
    {
      duracion = 120;
    }

    for(let i = 0; i < this.listaEspecialistas.length; i++)
    {
      if(this.listaEspecialistas[i].email == this.db.emailUsuarioAct)
      {
        this.idEspecialista = this.listaEspecialistas[i].id;
      }
    }
    
    if(this.idEspecialista)
    {
      console.log(this.listaHorarios);
      for(let i = 0;i < this.listaHorarios.length; i++)
      {
        if((parseInt(this.listaHorarios[i].especialista.id) == this.idEspecialista) && (this.listaHorarios[i].dia == dia))
        {
          horarioDiaOcupado = true;
        }
      }

      if(horarioDiaOcupado == false)
      {
        this.db.agregarHorario(this.idEspecialista,dia,this.especialidadElegida,duracion);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Horario agregado",
          showConfirmButton: false,
          timer: 2000
        });
      }
      else
      {
        this.db.actualizarHorario(this.idEspecialista,dia,duracion).then((data)=>{
          console.log(data);
          if(data == null)
          {
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Horario actualizado",
              showConfirmButton: false,
              timer: 2000
            });        
          }
          else
          {
            Swal.fire({
              position: "top",
              icon: "success",
              title: "No se pudo actualizar el horario",
              showConfirmButton: false,
              timer: 2000
            });                
          }
        });
      }
    }
  }

  cambiarEspecialidadElegida(especialidad: string,nombreBoton: string)
  {
    this.especialidadElegida = especialidad;
    console.log(this.especialidadElegida);
    const btnA = document.getElementById('especialidadUno');
    const btnB = document.getElementById('especialidadDos');
    if(btnA && btnB)
    {
      if(nombreBoton == 'especialidadUno')
      {
        btnA.classList.remove('btn-secondary');
        btnA.classList.add('btn-danger');

        btnB.classList.remove('btn-danger');
        btnB.classList.add('btn-secondary');
      }
      else if(nombreBoton == 'especialidadDos')
      {
        btnB.classList.remove('btn-secondary');
        btnB.classList.add('btn-danger');

        btnA.classList.remove('btn-danger');
        btnA.classList.add('btn-secondary');  
      }
    }
  }

  abrirHistorial(idPaciente : number)
  {
    this.db.mostrarHistorial = true;
    this.db.idPaciente = idPaciente;
    this.router.navigate(['/historial_clinico']);    
  }
}
