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

  filtrarTurno()
  {
    const texto = this.busquedaTexto.toLowerCase().trim();

    if(texto == '')
    {
      this.listaEncontrados = [...this.listaTurnos];
      return;
    }

    this.listaEncontrados = this.listaTurnos.filter(turno => {
      let coincide = (
        String(turno.id).toLowerCase().includes(texto) ||
        String(turno.fecha).toLowerCase().includes(texto) ||
        String(turno.paciente.nombre).toLowerCase().includes(texto) ||
        String(turno.especialidad).toLowerCase().includes(texto) ||
        String(turno.especialista.nombre).toLowerCase().includes(texto) ||
        String(turno.paciente.obraSocial).toLowerCase().includes(texto) ||
        String(turno.estado).toLowerCase().includes(texto)
      );

      // Si tiene historial subido, buscar también en historial_clinico
      if (turno.historial_subido) {
        const historial = this.listaHistoriales.find(
          h => h.turno.id == turno.id // depende de cómo esté el campo
        );

        if (historial) {
          coincide ||= (
            String(historial.altura).toLowerCase().includes(texto) ||
            String(historial.peso).toLowerCase().includes(texto) ||
            String(historial.temperatura).toLowerCase().includes(texto) ||
            String(historial.presion).toLowerCase().includes(texto) ||
            Object.entries(historial.datoDinamico || {}).some(([clave, valor]) => {
              return (
                String(clave).toLowerCase().includes(texto) ||
                String(valor).toLowerCase().includes(texto)
              );
            })
          );
        }
      }

      return coincide;

    });
    // this.listaEncontrados = listaDatoTurnoEncontrado;

    // for(let d of listaDatosEncontrados)
    // {
    //   this.listaEncontrados.push(d);
    // }



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

