import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { 
  AbstractControl,
  FormControl, 
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-turnos',
  imports: [FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent {
  // servicios
  db = inject(DatabaseService);
  router = inject(Router);

  listaTurnos : any[] = [];
  listaEncontrados : any[] = [];
  listaTurnosCompleta : any[] = [];
  listaComentarios: any[] = [];

  // variables de la barra de busqueda
  busquedaTexto : string = "";
  todosTurnos: boolean = false;
  mensajeEstadoB : string = "";

  constructor()
  {
    this.db.listarTurnos().then((turnos: any[])=>{
      this.todosTurnos = true;
      this.listaTurnosCompleta = turnos;
      this.listaTurnos = this.listaTurnosCompleta;
    });    

    this.db.listarComentarios().then((comentarios: any[])=>{
      this.listaComentarios = comentarios;
      console.log(this.listaComentarios);
    });
  }

  ngOnInit()
  {
    if(this.todosTurnos == true)
    {
      this.listaTurnos = this.listaTurnosCompleta;
    }
    else
    {
      this.listaTurnos = this.listaEncontrados;
    }
  }

  buscar()
  {
    if(this.busquedaTexto != "")
    {
      for(let i = 0; i < this.listaTurnos.length; i++)
      {
        if(this.busquedaTexto.toLowerCase() == this.listaTurnos[i].especialista.nombre.toLowerCase() || (this.busquedaTexto.toLowerCase() == this.listaTurnos[i].especialidad.toLowerCase()))
        {
          this.listaEncontrados.push(this.listaTurnos[i]);
        }
      }

      if(this.listaEncontrados.length > 0)
      {
        if(this.listaEncontrados.length == 1)
        {
          this.mensajeEstadoB = "Hay " + this.listaEncontrados.length + " coincidencia";
        }
        else
        {
          this.mensajeEstadoB = "Hay " + this.listaEncontrados.length + " coincidencias";          
        }
        this.todosTurnos = false;
        this.ngOnInit();
      }
      else
      {
        this.mensajeEstadoB = "No hay ningun especialista o especialidad con ese nombre";
      }
    }
  }

  reiniciar()
  {
    this.todosTurnos = true;
    this.busquedaTexto = "";
    this.mensajeEstadoB = "";
    this.listaEncontrados = [];
    this.ngOnInit();
  }

  cambiarEstado(estadoNuevo: string,idTurno : number = 0)
  {
    if(estadoNuevo == "cancelado" || estadoNuevo == "rechazado")
    {
      this.db.mostrarCuestionario = false;
      this.db.idTurno = idTurno;
      // redirigir a encuesta
      this.router.navigate(['/encuesta']);
      // una ves terminado la encuesta
      setTimeout(()=>{
        this.db.cambiarEstadoTurno(estadoNuevo,idTurno).then((data)=>{
          if(data != null)
          {
            this.ngOnInit();
          }
        });
      },1000);
    }
    else
    {
      console.log("modificar el estado nuevo del tuno: " + idTurno);
        this.db.cambiarEstadoTurno(estadoNuevo,idTurno).then((data)=>{
          console.log(data);
        if(data != null)
        {
          this.ngOnInit();
        }
      });
    }

  }

  verComentario(idTurno : number)
  {
    this.db.mostrarCuestionario = true;
    this.db.idTurno = idTurno;
    console.log("mostrar cuestionario: " + this.db.mostrarCuestionario + " | id de turno:" + this.db.idTurno);
    setTimeout(()=>{
      this.router.navigate(['/encuesta']);
    },1000);
  }
}

