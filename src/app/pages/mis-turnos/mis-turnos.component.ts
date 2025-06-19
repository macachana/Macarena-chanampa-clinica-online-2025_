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

import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-turnos',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
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
  listaHistoriales : any[] = [];

  // variables de la barra de busqueda
  busquedaTexto : string = "";
  todosTurnos: boolean = false;
  mensajeEstadoB : string = "";

  constructor()
  {
    this.db.listarTurnos().then((turnos: any[])=>{
      this.todosTurnos = true;
      this.listaTurnos = turnos;
      this.listaEncontrados = this.listaTurnos;      
    });    

    this.db.listarComentarios().then((comentarios: any[])=>{
      this.listaComentarios = comentarios;
      console.log(this.listaComentarios);
    });

    this.db.listarHistorial().then((historiales)=>{
      this.listaHistoriales = historiales;
    });
  }

  ngOnInit()
  {
    this.listaEncontrados = this.listaTurnos;
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
        // String(this.buscarDato(turno.id)).toLowerCase().includes(texto)
      );
    });


    // const texto = this.busquedaTexto.toLowerCase().trim();

    // if(texto == '')
    // {
    //   this.listaEncontrados = [...this.listaTurnos];
    //   return;
    // }

    // let listaCombinada = [...this.listaTurnos];

    // this.listaEncontrados = listaCombinada.filter(turno => {
    //   return (
    //     String(turno.fecha).toLowerCase().includes(texto) ||
    //     String(turno.especialista.nombre).toLowerCase().includes(texto) ||
    //     String(turno.especialidad).toLocaleLowerCase().includes(texto) ||
    //     String(turno.paciente.nombre).toLowerCase().includes(texto) ||
    //     String(turno.paciente.ObraSocial).toLowerCase().includes(texto) ||
    //     String(turno.estado).toLowerCase().includes(texto) ||
        // String(turno.altura).toLowerCase().includes(texto) ||
        // String(turno.peso).toLowerCase().includes(texto) ||
        // String(turno.temperatura).toLowerCase().includes(texto) ||
        // String(turno.presion).toLowerCase().includes(texto) ||
        // String(turno.datoDinamico[0]).toLowerCase().includes(texto) ||
        // String(turno.datoDinamico[1]).toLowerCase().includes(texto) ||
        // String(turno.datoDinamico[2]).toLowerCase().includes(texto)                
      // );
    // });

  }

  buscarDato(idTurno : number | undefined) : any
  {

    return "";
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
    console.log("modificar el estado nuevo del tuno: " + idTurno);
      this.db.cambiarEstadoTurno(estadoNuevo,idTurno).then((data)=>{
      if(data == null)
      {
        setTimeout(()=>{
          this.ngOnInit();
        },2000);
      }
    });
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

  iniciarCuestionarioTurno(estadoNuevo: string,idTurno : number)
  {
    this.db.idTurno = idTurno;
    this.db.estadoNuevoCuestionario = estadoNuevo;
    this.router.navigate(['/encuesta']);
  }

  iniciarHistorialClinico(idPaciente: number | undefined,idTurno : number)
  {
    this.db.mostrarHistorial = false;
    this.db.idPaciente = idPaciente;
    this.db.idTurno = idTurno;
    this.router.navigate(['/historial_clinico']);
  }

  verHistorial(idPaciente: number | undefined)
  {
    this.db.mostrarHistorial = true;
    this.db.idPaciente = idPaciente;
    this.router.navigate(['/historial-clinico']);
  }

  obtenerClaves(datoDinamico: {}) : any[]
  {
    return Object.keys(datoDinamico);
  }
}

