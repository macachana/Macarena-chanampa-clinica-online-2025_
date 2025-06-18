import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial-clinico',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './historial-clinico.component.html',
  styleUrl: './historial-clinico.component.css',
  standalone: true
})
export class HistorialClinicoComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  listaHistorial : any[] = [];

  clave01 : string = '';
  valor01 : string = '';

  clave02 : string = '';
  valor02 : string = '';

  clave03 : string = '';
  valor03 : string = '';

  formHistoria = new FormGroup({
    altura: new FormControl('',{
      validators: [Validators.required, Validators.min(0), Validators.max(3)]
    }),
    peso: new FormControl('',{
      validators: [Validators.required, Validators.min(0), Validators.max(200)]      
    }),
    temperatura: new FormControl('',{
      validators: [Validators.required, Validators.min(35), Validators.max(50)]
    }),
    presion: new FormControl('',{
      validators: [Validators.required, Validators.min(60), Validators.max(200)]
    })
  });

  constructor()
  {
    this.db.listarHistorial().then((historial: any[])=>{
      this.listaHistorial = historial;
    });
  }

  guardarHistorial()
  {
    const { altura, peso, temperatura, presion } = this.formHistoria.value;
    const idPaciente = this.db.idPaciente;

    let clave1 = (<HTMLInputElement>document.getElementById("clave01")).value;
    let clave2 = (<HTMLInputElement>document.getElementById("clave02")).value;
    let clave3 = (<HTMLInputElement>document.getElementById("clave03")).value;

    let valor1 = (<HTMLInputElement>document.getElementById("valor01")).value;
    let valor2 = (<HTMLInputElement>document.getElementById("valor02")).value;
    let valor3 = (<HTMLInputElement>document.getElementById("valor03")).value;

    let datoDinamico: {[key:string]:any} = {};

    if(clave1 && valor1)
    {
      datoDinamico[clave1] = valor1;
    }

    if(clave2 && valor2)
    {
      datoDinamico[clave2] = valor2;
    }

    if(clave3 && valor3)
    {
      datoDinamico[clave3] = valor3;
    }

    console.log("como se envia el dato dinamico");
    console.log(datoDinamico);

    console.log("dato dinamico");
    console.log(clave1 + " : " + valor1);
    console.log(clave2 + " : " + valor2);
    console.log(clave3 + " : " + valor3);

    console.log("datos fijos");
    console.log("altura: " + altura);
    console.log("peso: " + peso);
    console.log("temperatura: " + temperatura);

    if(this.formHistoria.valid)
    {
      if(altura && peso && temperatura && presion)
      {
        console.log("form valido y datos cargados");
        this.db.agregarHistorial(parseFloat(altura), parseFloat(peso), parseFloat(temperatura), parseFloat(presion), idPaciente, datoDinamico).then((data)=>{
          console.log(data);
          if(data == null)
          {
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Historial clínico agregado...",
              showConfirmButton: false,
              timer: 2000
            });
          }
          else
          {
            Swal.fire({
              position: "top",
              icon: "error",
              title: "No se pudo agregar el historial cliínico...",
              showConfirmButton: false,
              timer: 2000
            });            
          }
        });
        this.db.cambiarEstadoClinicoTurno();
      }
    }
  }

}
