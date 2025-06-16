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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {

  //servicios
  db = inject(DatabaseService);
  router = inject(Router);

  listaTurnos : any[] = [];
  listaEncontrados : any[] = [];
  listaTurnosCompleta : any[] = [];
  listaComentarios: any[] = [];

  // variables de la barra de busqueda
  busquedaTexto : string = '';
  todosTurnos: boolean = false;
  mensajeEstadoB : string = "";

  constructor()
  {
    this.db.listarTurnos().then((turnos: any[])=>{
      // this.todosTurnos = true;
      // this.listaTurnosCompleta = turnos;
      this.listaTurnos = turnos;
      this.listaEncontrados = this.listaTurnos;
      console.log(this.listaEncontrados);
    });  
  }

  ngOnInit()
  {
    this.listaEncontrados = this.listaTurnos;
    // this.buscar();
    // if(this.todosTurnos == true)
    // {
    //   this.listaTurnos = this.listaTurnosCompleta;
    // }
    // else
    // {
    //   this.listaTurnos = this.listaEncontrados;
    // }
  }

  filtrarTurno()
  {
    const texto = this.busquedaTexto.toLowerCase().trim();

    if(texto == '')
    {
      this.listaEncontrados = [...this.listaTurnos];
      return;
    }

    this.listaEncontrados = this.listaTurnos.filter(turno => {
      return (
        String(turno.fecha).toLowerCase().includes(texto) ||
        String(turno.especialista.nombre).toLowerCase().includes(texto) ||
        String(turno.especialidad).toLocaleLowerCase().includes(texto) ||
        String(turno.paciente.nombre).toLowerCase().includes(texto) ||
        String(turno.paciente.ObraSocial).toLowerCase().includes(texto) ||
        String(turno.estado).toLowerCase().includes(texto)
      );
    });

  }

  // onTextoCambio(valor: string)
  // {
  //   this.busquedaTexto = valor; 
  //   console.log(valor);
  // }
  
  // buscar()
  // {
  //   if(this.busquedaTexto != "")
  //   {

  //     for(let i = 0; i < this.listaTurnos.length; i++)
  //     {
  //       if(this.busquedaTexto.toLowerCase() == this.listaTurnos[i].especialista.nombre.toLowerCase() || (this.busquedaTexto.toLowerCase() == this.listaTurnos[i].especialidad.toLowerCase()))
  //       {
  //         this.listaEncontrados.push(this.listaTurnos[i]);
  //       }
  //     }

  //     if(this.listaEncontrados.length > 0)
  //     {
  //       if(this.listaEncontrados.length == 1)
  //       {
  //         this.mensajeEstadoB = "Hay " + this.listaEncontrados.length + " coincidencia";
  //       }
  //       else
  //       {
  //         this.mensajeEstadoB = "Hay " + this.listaEncontrados.length + " coincidencias";          
  //       }
  //       this.todosTurnos = false;
  //       this.ngOnInit();
  //     }
  //     else
  //     {
  //       this.mensajeEstadoB = "No hay ningun especialista o especialidad con ese nombre";
  //       this.listaTurnos = [];
  //     }
  //   }
  // }

  cambiarEstado(estadoNuevo: string,idTurno : number = 0)
  {
    this.db.mostrarCuestionario = false;
    this.db.idTurno = idTurno;

    // redirigir a encuesta
    this.router.navigate(['/encuesta']);

    // una ves terminado la encuesta
    this.db.cambiarEstadoTurno(estadoNuevo,idTurno);
  }

  reiniciar()
  {
    this.todosTurnos = true;
    this.busquedaTexto = "";
    this.mensajeEstadoB = "";
    this.listaEncontrados = [];
    this.ngOnInit();
  }
}
