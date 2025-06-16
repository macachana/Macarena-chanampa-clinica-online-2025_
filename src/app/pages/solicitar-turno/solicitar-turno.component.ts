import { Component, inject } from '@angular/core';

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
import Swal from 'sweetalert2';

import { DatabaseService } from '../../services/database.service';
import { Especialista } from '../../clases/especialista';
import { Paciente } from '../../clases/paciente';


@Component({
  selector: 'app-solicitar-turno',
  imports: [],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  // si es paciente: seleccion de especialidad
  // si es administrador: seleccion de paciente
  primeraSeleccion : boolean = true;

  //-----------------------------------------------------

  // si es paciente: seleccion de especialista
  // si es administrador: seleccion de especialidad
  segundaSeleccion : boolean = false;

    //-----------------------------------------------------

  // si es paciente: seleccion de dia (dentro de los 15 proximos días)
  // si es administrador: seleccion de especialista
  terceraSeleccion : boolean = false;
  
  //-------------------------------------------------
  
  // si es paciente: seleccion de horario
  // si es administrador: seleccion de dia (dentro de los 15 proximos días)
  cuartaSeleccion : boolean = false;

  //-------------------------------------------------
  
  // si es administrador: seleccion de horario
  quintaSeleccion : boolean = false;

  // seleccion
  especialidadElegida : string = ""; // ESPECIALIDAD ELEGIDA
  pacienteElegido : number | undefined = 0; // PACIENTE ELEGIDO
  nombrePacienteEleg : string = "";

  especialistaElegido : number | undefined = 0; // ESPECIALISTA ELEGIDO
  nombreEspecialistaEleg : string = "";
  
  fechaElegida : string = ""; // FECHA ELEGIDO
  horarioElegido : string = ""; // HORARIO ELEGIDO

  diaSemanaElegida : string = ""; //DIA DE SEMANA DE LA FECHA
  duracionTurno : number = 0; // DURACION DEL TURNO

  // LISTAS
  listaEspecialidades : Set<string | null> = new Set();
  listaEspecialistas : Especialista[] = [];
  listaPacientes: Paciente[] = [];
  listaTurnos: any[] = [];
  listaHorarios : any[] = [];
  listaFechas: any[] = [];

  todosHorarios : string[] = [];
  horariosOcupados: string[] = [];
  horariosDisponibles: string[] = [];
  diasLaborales : string[] = [];

  ngOnInit()
  {
    this.cargarListas();
  }

  cargarListas()
  {
    this.db.listarEspecialistas().then((especialistas : Especialista[])=>{
      for(let i = 0; i < especialistas.length; i++)
      {
        if(especialistas[i].segundaEspecialidad !== null)
        {
          this.listaEspecialidades.add(especialistas[i].especialidad);
          this.listaEspecialidades.add(especialistas[i].segundaEspecialidad);        
        }
        else
        {
          this.listaEspecialidades.add(especialistas[i].especialidad);          
        }
      }
    });

    this.db.listarPacientes().then((pacientes : Paciente[])=>{
      this.listaPacientes = pacientes;
    });

    // this.db.obtenerEspecialidades().then((especialidades : any[])=>{
    //   for(let i = 0; i < especialidades.length; i++)
    //   {
    //     if(especialidades[i].segundaEspecialidad == null)
    //     {
    //       this.listaEspecialidades.add(especialidades[i].especialidad);
    //     }
    //     else
    //     {
    //       this.listaEspecialidades.add(especialidades[i].especialidad);
    //       this.listaEspecialidades.add(especialidades[i].segundaEspecialidad);
    //     }
    //   }
    //   console.log(this.listaEspecialidades);
    // });

    this.db.listarEspecialistas().then((especialistas : Especialista[])=>{
      this.listaEspecialistas = especialistas;
    });

    this.db.listarTurnos().then((turnos: any[])=>{
      this.listaTurnos = turnos;
    });

    this.db.listarHorarios().then((horarios: any[])=>{
      this.listaHorarios = horarios;
    });
  }

  seleccionarEspecialidad(nombreEspecialidad : string | null = "doctor")
  {
    if(this.db.tipoUsuario == "paciente")
    {
      this.primeraSeleccion = false;
  
      if(nombreEspecialidad != null)
      {
        this.especialidadElegida = nombreEspecialidad;
        this.segundaSeleccion = true;
      }
    }
    else
    {
      this.segundaSeleccion = false;
  
      if(nombreEspecialidad != null)
      {
        this.especialidadElegida = nombreEspecialidad;
        this.terceraSeleccion = true;
      }      
    }
  }

  seleccionarEspecialista(id : number)
  {
    this.diasLaborales = [];
    this.listaFechas = [];
    if(this.db.tipoUsuario == "paciente")
    {
      this.segundaSeleccion = false;
  
      if(id != null)
      {
        for(let i = 0; i < this.listaHorarios.length; i++)
        {
          if((this.listaHorarios[i].especialista.id == id) && (this.listaHorarios[i].especialidad == this.especialidadElegida))
          {
            console.log(this.listaHorarios[i].especialista.id + " = " + id);
            console.log(this.listaHorarios[i].especialidad + " = " + this.especialidadElegida);
            this.diasLaborales.push(this.listaHorarios[i].dia);
          }
        }

        let l = 15;
        for (let i = 1; i <= l; i++) {
          const hoy = new Date();
          const fecha = new Date(hoy);
          fecha.setDate(hoy.getDate() + i);

          const formato = fecha.toISOString().split('T')[0]; // yyyy-mm-dd
          const nombreDia = this.obtenerNombreDia(formato);

          if(this.diasLaborales.includes(nombreDia))
          {
            if(this.listaFechas.length < 15)
            {
              const mes = this.determinarMes(formato.split('-')[1]);
              this.listaFechas.push({"id":i,"fecha": formato.split('-')[2] + ' de ' + mes,"dia":this.obtenerNombreDia(formato)});              
              l ++;
            }
            console.log(this.listaFechas);
          }
        } 
        
        this.especialistaElegido = id;
        this.terceraSeleccion = true;
      }
    }
    else
    {
      this.terceraSeleccion = false;

      if(id != null)
      {
        for(let i = 0; i < this.listaHorarios.length; i++)
        {
          if((this.listaHorarios[i].especialista.id == id) && (this.listaHorarios[i].especialidad == this.especialidadElegida))
          {
            this.diasLaborales.push(this.listaHorarios[i].dia);
          }
        }

        let l = 15;
        for (let i = 1; i <= l; i++) {
          const hoy = new Date();
          const fecha = new Date(hoy);
          fecha.setDate(hoy.getDate() + i);

          const formato = fecha.toISOString().split('T')[0]; // yyyy-mm-dd
          const nombreDia = this.obtenerNombreDia(formato);

          if(this.diasLaborales.includes(this.obtenerNombreDia(formato)))
          {
            if(this.listaFechas.length < 15)
            {
              const mes = this.determinarMes(formato.split('-')[1]);
              this.listaFechas.push({"id":i,"fecha": formato.split('-')[2] + ' de ' + mes,"dia":this.obtenerNombreDia(formato)});              
              l ++;
            }
            console.log(this.listaFechas);
          }
        } 
      }    
      this.especialistaElegido = id;
      this.cuartaSeleccion = true;        
    }
  }

  seleccionarFecha(fecha:string, diaSemana: string)
  {
    if(this.db.tipoUsuario == "paciente")
    {
      this.terceraSeleccion = false;
      if((fecha != null) && (diaSemana != null))
      {
        this.fechaElegida = fecha;
        this.diaSemanaElegida = diaSemana;

        for(let i = 0; i < this.listaHorarios.length; i++)
        {
          if((this.listaHorarios[i].especialista.id == this.especialistaElegido) && (this.listaHorarios[i].dia == this.diaSemanaElegida))
          {
            this.duracionTurno = this.listaHorarios[i].duracion;
          }
        }

        if(this.duracionTurno != 0)
        {
            this.generarHorarios(this.duracionTurno);
        }
        this.cuartaSeleccion = true;
      }
    }
    else
    {
      this.cuartaSeleccion = false;
      if((fecha != null) && (diaSemana != null))
      {
        this.fechaElegida = fecha;
        this.diaSemanaElegida = diaSemana;

        for(let i = 0; i < this.listaHorarios.length; i++)
        {
          if((this.listaHorarios[i].especialista.id == this.especialistaElegido) && (this.listaHorarios[i].dia == this.diaSemanaElegida))
          {
            this.duracionTurno = this.listaHorarios[i].duracion;
          }
        }        
  
        if(this.duracionTurno != 0)
        {
            this.generarHorarios(this.duracionTurno);
        }
        this.quintaSeleccion = true;
      }
    }
  }

  seleccionarPaciente(id: number | undefined)
  {
    if(id != null)
    {
      this.pacienteElegido = id;
    }

    this.primeraSeleccion = false;
    this.segundaSeleccion = true;
  }

  obtenerNombreDia(fecha: string) : string
  {
    const dias = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
    const fechaObj = new Date(fecha);
    const numeroDia = fechaObj.getDay();
    return dias[numeroDia];
  }

  determinarMes(numeroMes : string) : string
  {
    let mes:string = "";
    if(numeroMes == "01")
    {
      mes = "enero";
    }
    else if(numeroMes == "02")
    {
      mes = "febrero";
    }
    else if(numeroMes == "03")
    {
      mes = "marzo";
    }
    else if(numeroMes == "04")
    {
      mes = "abril";
    }
    else if(numeroMes == "05")
    {
      mes = "mayo";
    }
    else if(numeroMes == "06")
    {
      mes = "junio";
    }
    else if(numeroMes == "07")
    {
      mes = "julio";
    }
    else if(numeroMes == "08")
    {
      mes = "agosto";
    }
    else if(numeroMes == "09")
    {
      mes = "septiembre";
    }
    else if(numeroMes == "10")
    {
      mes = "octubre";
    }
    else if(numeroMes == "11")
    {
      mes = "noviembre";
    }
    else if(numeroMes == "12")
    {
      mes = "diciembre";
    }

    return mes;
  }

  generarHorarios(cadaMinutos: number, finSemana:boolean = false) {
    this.todosHorarios = [];
    this.horariosOcupados = [];
    this.horariosDisponibles = [];
    const inicio = new Date();    
    inicio.setHours(8, 0, 0, 0); // 08:00
    
    const fin = new Date();

    if(finSemana == false)
    {
      fin.setHours(19, 0, 0, 0); // 19:00
    }
    else
    {
      fin.setHours(14, 0, 0, 0); // 14:00      
    }

    while (inicio < fin) {
      const hora = inicio.toTimeString().substring(0, 5); // Formato "HH:MM"
      this.todosHorarios.push(hora);
      // this.horarios.push(hora);
      inicio.setMinutes(inicio.getMinutes() + cadaMinutos);
    }

    this.generarHorariosOcupados();
    
    // this.generarHorariosOcupados();

    this.horariosDisponibles = this.todosHorarios.filter(h => !this.horariosOcupados.includes(h));

    console.log("TODOS LOS HORARIOS");
    console.log(this.todosHorarios);
    console.log("HORARIOS OCUPADOS");
    console.log(this.horariosOcupados);
    console.log("HORARIOS DISPONIBLES");
    console.log(this.horariosDisponibles);
  }

  generarHorariosOcupados()
  {
    for(let i = 0;i < this.listaTurnos.length; i++)
    {
      if((this.listaTurnos[i].especialista.id == this.especialistaElegido) && (this.listaTurnos[i].fecha == this.fechaElegida))
      {
        this.horariosOcupados.push(this.listaTurnos[i].horario);
      }
    }
  }

  generarPeticion(horarioElegido:string)
  {
    if(this.db.tipoUsuario == "paciente")
    {
      this.horarioElegido = horarioElegido;
  
      for(let j = 0; j < this.listaEspecialistas.length; j++)
      {
        if(this.listaEspecialistas[j].id == this.especialistaElegido)
        {
          this.nombreEspecialistaEleg = this.listaEspecialistas[j].nombre + " " + this.listaEspecialistas[j].apellido;
        }
      }
  
      this.cuartaSeleccion = false;
      this.quintaSeleccion = true;
    }
    else
    {
      this.horarioElegido = horarioElegido;
  
      for(let j = 0; j < this.listaEspecialistas.length; j++)
      {
        if(this.listaEspecialistas[j].id == this.especialistaElegido)
        {
          this.nombreEspecialistaEleg = this.listaEspecialistas[j].nombre + " " + this.listaEspecialistas[j].apellido;
        }
      }

      for(let i = 0; i < this.listaPacientes.length; i++)
      {
        if(this.listaPacientes[i].id == this.pacienteElegido)
        {
          this.nombrePacienteEleg = this.listaPacientes[i].nombre + " " + this.listaPacientes[i].apellido;
        }
      }      
  
      this.quintaSeleccion = false;
    }
  }

  confirmarTurno()
  {
    if(this.db.tipoUsuario == "paciente")
    {
      let idPaciente : number | undefined = 0;

      for(let i = 0; i < this.listaPacientes.length; i++)
      {
        if(this.listaPacientes[i].email == this.db.emailUsuarioAct)
        {
          idPaciente = this.listaPacientes[i].id;
        } 
      }     

      const idEspecialista : number | undefined = this.especialistaElegido;
      const especialidad = this.especialidadElegida;
      const fecha = this.fechaElegida;
      const horario = this.horarioElegido;
      const duracion_minutos = this.duracionTurno;
      if((idEspecialista != null) && (idPaciente != null))
      {
        this.db.agregarTurno(idEspecialista, idPaciente, especialidad, fecha, horario, duracion_minutos).then((data)=>{
          if(data == null)
          {
            Swal.fire({
              position: "top",
              icon: "success",
              title: "TURNO SOLICITADO. Redirigiendo a 'MIS TURNOS'...",
              showConfirmButton: false,
              timer: 2000
            });        
            setTimeout(()=>{
              this.router.navigate(['/mis_turnos']);
            },2100);
          }
          else
          {
            Swal.fire({
              position: "top",
              icon: "error",
              title: "ERROR AL SOLICITAR TURNO.",
              showConfirmButton: false,
              timer: 2000
            });  
          }
        });
      }
    }
    else
    {
      const idEspecialistaAd : number | undefined = this.especialistaElegido;
      const especialidadAd : string = this.especialidadElegida;
      const fechaAd : string = this.fechaElegida;
      const horarioAd : string = this.horarioElegido;
      const duracion_minutosAd : number = this.duracionTurno;
      const idPacienteAd : number | undefined = this.pacienteElegido;   
      
      for(let i = 0; i < this.listaPacientes.length; i++)
      {
        if(this.listaPacientes[i].id == idPacienteAd)
        {
          this.nombrePacienteEleg = this.listaPacientes[i].nombre + " " + this.listaPacientes[i].apellido;
        } 
      }

      if((idEspecialistaAd != null) && (idPacienteAd != null))
      {
        this.db.agregarTurno(idEspecialistaAd, idPacienteAd, especialidadAd, fechaAd, horarioAd, duracion_minutosAd).then((data)=>{
          if(data == null)
          {
            Swal.fire({
              position: "top",
              icon: "success",
              title: "TURNO SOLICITADO. Redirigiendo a 'MI PERFIL'...",
              showConfirmButton: false,
              timer: 2000
            });        
            setTimeout(()=>{
              this.router.navigate(['/mi_perfil']);
            },2100);
          }
          else
          {
            Swal.fire({
              position: "top",
              icon: "error",
              title: "ERROR AL SOLICITAR TURNO.",
              showConfirmButton: false,
              timer: 2000
            });  
          }
        });
      }      
    }
    
  }


  volver(numeroSeccion: number = 1)
  {
    if(this.db.tipoUsuario == "paciente")
    {
      switch(numeroSeccion)
      {
        case 1:
          this.router.navigate(['/mi_perfil']);
          break;
        case 2:
          this.segundaSeleccion = false;
          this.primeraSeleccion = true;
          break;
        case 3:
          this.terceraSeleccion = false;
          this.segundaSeleccion = true;
          break;
        case 4:
          this.cuartaSeleccion = false;
          this.terceraSeleccion = true;
          break;
        case 5:
          this.horariosDisponibles = [];
          this.quintaSeleccion = false;
          this.terceraSeleccion = true;
          break;
      }
    }
    else
    {
      switch(numeroSeccion)
      {
        case 1:
          this.router.navigate(['/mi_perfil']);
          break;
        case 2:
          this.segundaSeleccion = false;
          this.primeraSeleccion = true;
          break;
        case 3:
          this.terceraSeleccion = false;
          this.segundaSeleccion = true;
          break;
        case 4:
          this.cuartaSeleccion = false;
          this.terceraSeleccion = true;
          break;
        case 5:
          this.quintaSeleccion = false;
          this.cuartaSeleccion = true;
          break;
        case 6:
          this.horariosDisponibles = [];
          this.router.navigate(['/mi_perfil']);
      }
    }
  }
}
