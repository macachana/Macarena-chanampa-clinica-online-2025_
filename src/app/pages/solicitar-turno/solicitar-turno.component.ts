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


@Component({
  selector: 'app-solicitar-turno',
  imports: [],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  // seleccion de especialidad
  primeraSeleccion : boolean = true;

  especialidadElegida : string = "";

  // seleccion de especialista
  segundaSeleccion : boolean = false;

  especialistaElegido : string = "";

  // seleccion de dia y horario (dentro de los 15 proximos días)
  terceraSeleccion : boolean = false;

  diaHorarioElegido : string = "";

  listaEspecialidades : Set<string | null> = new Set();
  listaEspecialistas : Especialista[] = [];

  listaDiasDisponibles : any[] = [];
  listaHorariosDisponibles : any[] = [];

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
  }

  seleccionarEspecialidad(nombreEspecialidad : string | null = "doctor")
  {
    this.primeraSeleccion = false;

    if(nombreEspecialidad != null)
    {
      this.especialidadElegida = nombreEspecialidad;
      this.segundaSeleccion = true;
    }
  }

  seleccionarEspecialista(nombre : string)
  {
    this.segundaSeleccion = false;

    if(nombre != null)
    {
      this.especialistaElegido = nombre;
      this.terceraSeleccion = true;
    }
  }

  volver()
  {
    this.router.navigate(['/mi_perfil']);
  }

}
