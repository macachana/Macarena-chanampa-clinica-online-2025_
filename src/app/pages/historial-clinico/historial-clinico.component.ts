import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Especialista } from '../../clases/especialista';
import { jsPDF } from 'jspdf';
import { trigger, transition, style, animate, query, animateChild, group, state, keyframes } from '@angular/animations';

import { NgClass } from '@angular/common';

@Component({
  selector: 'app-historial-clinico',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, NgClass],
  templateUrl: './historial-clinico.component.html',
  styleUrl: './historial-clinico.component.css',
  standalone: true,
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ transform: 'scale(1)'})),
      state('collapsed', style({ transform: 'scale(0.8)'})),
      transition('expanded => collapsed', animate('300ms ease-in')),
      transition('collapsed => expanded', animate('300ms ease-out'))
    ])
  ]
})
export class HistorialClinicoComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  listaHistorial : any[] = [];

  sinHistorial : boolean = false;

  datoDinamico: { [key: string]: any } = {};

  clave01 : string = '';
  valor01 : string = '';

  clave02 : string = '';
  valor02 : string = '';

  clave03 : string = '';
  valor03 : string = '';

  listaEspecialistas : Especialista[] = [];
  listaEspecialidades : Set<string | undefined> = new Set();

  especialidadSeleccionada : string = "";

  expandState = 'collapsed';
  expandState02 = 'collapsed';

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
    this.db.listarHistorial().then((historiales: any[])=>{
      this.listaHistorial = historiales;
    });

    this.db.listarEspecialistas().then((especialistas : Especialista[])=>{
      for(let i = 0; i < especialistas.length; i++)
      {
        if(especialistas[i].segundaEspecialidad !== null)
        {
          this.listaEspecialidades.add(especialistas[i].especialidad.toUpperCase());
          this.listaEspecialidades.add(especialistas[i].segundaEspecialidad?.toUpperCase());        
        }
        else
        {
          this.listaEspecialidades.add(especialistas[i].especialidad.toUpperCase());          
        }
      }
    });  
  }

  ngOnInit()
  {
    if(this.especialidadSeleccionada == '')
    {
      this.sinHistorial = true;
    }
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

    if(clave1 && valor1)
    {
      this.datoDinamico[clave1] = valor1;
    }

    if(clave2 && valor2)
    {
      this.datoDinamico[clave2] = valor2;
    }

    if(clave3 && valor3)
    {
      this.datoDinamico[clave3] = valor3;
    }

    console.log("como se envia el dato dinamico");
    console.log(this.datoDinamico);

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
        this.db.agregarHistorial(parseFloat(altura), parseFloat(peso), parseFloat(temperatura), parseFloat(presion), idPaciente, this.datoDinamico,this.db.idTurno).then((data)=>{
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
            this.db.cambiarEstadoHistorial(this.db.idTurno);
            this.reiniciar();
            this.router.navigate(['/mis_turnos']);
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
      }
    }
  }

  reiniciar()
  {
    this.formHistoria.reset();
  }

  obtenerClaves(datoDinamico: {}) : any[]
  {
    return Object.keys(datoDinamico);
  }

  especialidadElegida(nombreEspecialidad: string | null)
  {
    if(nombreEspecialidad)
    {
      this.especialidadSeleccionada = nombreEspecialidad;
      this.botonSeleccionado();
    }

  }

  generarPDF(historialIngresado: number | undefined)
  {

    const hoy = new Date();
    const fecha = new Date(hoy);
    const formato = fecha.toISOString().split('T')[0]; // yyyy-mm-dd
    const hora = hoy.toTimeString().substring(0, 5); // Formato "HH:MM"
    
    if(historialIngresado)
    {
      // console.log(this.listaHistorial[historialIngresado]);

      let historialClinico: any = {};
    
      const doc = new jsPDF();
  
      for(let i = 0; i < this.listaHistorial.length; i++)
      {
        if(this.listaHistorial[i].turno.id == historialIngresado)
        {
          historialClinico = this.listaHistorial[i];
          console.log(historialClinico);
        }
      }

      let titulo = "Historial médico: " + historialClinico.turno.fecha + ' - ' + historialClinico.turno.horario + ' hs';  

      let logo = 'https://i.postimg.cc/59z68LyS/55-sin-t-tulo-1.png';

      let lineas : string[] = [
        'PACIENTE: ' + historialClinico.paciente.nombre + ' ' + historialClinico.paciente.apellido,
        '',
        'ESPECIALISTA: ' + historialClinico.turno.especialista.nombre + ' ' + historialClinico.turno.especialista.apellido,
        '',
        'ESPECIALIDAD: ' + historialClinico.turno.especialidad,
        '',
        'ALTURA: ' + historialClinico.altura,
        '',
        'PESO: ' + historialClinico.peso,
        '',
        'TEMPERATURA: ' + historialClinico.temperatura,
        '',
        'PRESIÓN: ' + historialClinico.presion,
      ];

      for(let clave of this.obtenerClaves(historialClinico.datoDinamico))
      {
        lineas.push('');
        lineas.push(clave.toUpperCase() + ': ' + historialClinico.datoDinamico[clave]);
      }

      lineas.push("");

      lineas.push('FECHA DE EMISION: ' + formato.split("-")[2] + "/" + formato.split("-")[1] + "/" + formato.split("-")[0]);

      console.log(lineas);

      this.convertirImagenUrlABase64(logo).then((imagenBase64) => {
          // Agregar título
          doc.setFontSize(30);
          doc.setFont('Arial','normal','bold');
          doc.text(titulo, 20, 20);

          // Agregar imagen
          doc.addImage(imagenBase64, 'PNG', 80, 30, 60, 60); // (img, tipo, x, y, width, height)

          // Texto con salto de línea
          doc.setFontSize(20);
          doc.setFont('Arial','normal','bold');
          doc.text(lineas, 20, 120); // x = 20, y = 100 (esto hara que el texto quede debajo de la imagen)

          // Guardar el PDF
          doc.save('historial_medico_' + historialClinico.paciente.nombre.toLowerCase() + '_' + historialClinico.paciente.apellido.toLowerCase() + '.pdf');
      });
    }
  }

  generarPDFCompleta()
  {
    const hoy = new Date();
    const fecha = new Date(hoy);
    const formato = fecha.toISOString().split('T')[0]; // yyyy-mm-dd
    const hora = hoy.toTimeString().substring(0, 5); // Formato "HH:MM"

    const margenX = 20;
    let posY = 120;
    const altoLinea = 10;
    const altoPagina = 290; // A4 es 297mm, dejamos margen

    const doc = new jsPDF();

    let lista_historial_medico : any[] = [];

    let titulo : string[] = [];

    titulo.push("Historial médico");
    titulo.push("email: " + this.db.emailUsuarioAct); 

    let logo = 'https://i.postimg.cc/59z68LyS/55-sin-t-tulo-1.png';

    for(let historial of this.listaHistorial)
    {
      if(historial.paciente.email == this.db.emailUsuarioAct)
      {
        lista_historial_medico.push(historial);
      }
    }

    if(lista_historial_medico.length > 0)
    {
      let lineas:string[] = [];
      for(let historial_propio of lista_historial_medico)
      {
        lineas.push('--- ' + historial_propio.turno.fecha + ' --- ' + historial_propio.turno.horario + ' hs');
        lineas.push('PACIENTE: ' + historial_propio.paciente.nombre + ' ' + historial_propio.paciente.apellido,          'ESPECIALISTA: ' + historial_propio.turno.especialista.nombre + ' ' + historial_propio.turno.especialista.apellido,
                    'ESPECIALIDAD: ' + historial_propio.turno.especialidad,
                    'ALTURA: ' + historial_propio.altura,
                    'PESO: ' + historial_propio.peso,
                    'TEMPERATURA: ' + historial_propio.temperatura,
                    'PRESIÓN: ' + historial_propio.presion);
        for(let clave of this.obtenerClaves(historial_propio.datoDinamico))
        {
          lineas.push(clave.toUpperCase() + ': ' + historial_propio.datoDinamico[clave]);
        }
        lineas.push("");
      }

      lineas.push("");

      lineas.push('FECHA DE EMISION: ' + formato.split("-")[2] + "/" + formato.split("-")[1] + "/" + formato.split("-")[0]);

      console.log(lineas);

      this.convertirImagenUrlABase64(logo).then((imagenBase64) => {
          // Agregar título
          doc.setFontSize(30);
          doc.setFont('Arial','normal','bold');
          doc.text(titulo, 20, 20);

          // Agregar imagen
          doc.addImage(imagenBase64, 'PNG', 80, 40, 60, 60); // (img, tipo, x, y, width, height)

          // Texto con salto de línea
          doc.setFontSize(20);
          doc.setFont('Arial','normal','bold');
          for(let linea of lineas)
          {
            if(posY > altoPagina)
            {
              doc.addPage();
              posY = 20;
            }

            doc.text(linea, margenX, posY); // x = 5, y = 100 (esto hara que el texto quede debajo de la imagen)
            posY += altoLinea;
          }

          // Guardar el PDF
          doc.save('historial_medico.pdf');
      });
    }
  }

  // Función para convertir una imagen a base64
  convertirImagenUrlABase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } else {
          reject('No se pudo obtener el contexto del canvas.');
        }
      };

      img.onerror = (err) => {
        reject('Error al cargar la imagen.');
      };
    });
  }

  onMouseEnter(numberButton: number = 1)
  {
    if(numberButton == 1)
    {
      this.expandState = 'expanded';
    }
    else
    {
      this.expandState02 = 'expanded';
    }
  }

  onMouseLeave(numberButton: number = 1)
  {
    if(numberButton == 1)
    {
      this.expandState = 'collapsed';
    }
    else
    {
      this,this.expandState02 = 'collapsed';
    }
  }

  botonSeleccionado()
  {
    if(this.especialidadSeleccionada != "")
    {
      for(let especialidad of this.listaEspecialidades)
      {
        if(especialidad == this.especialidadSeleccionada)
        {
          (<HTMLButtonElement>document.getElementById(especialidad)).className = 'btn btn-danger';
        }
        else
        {
          if(especialidad != null)
          {
            (<HTMLButtonElement>document.getElementById(especialidad)).className = 'btn btn-warning';
          }
        }
      }
    }
  }

  obtenerHistorialesPorESP() : any[]
  {
    let historialEncontrado : any[] = [];
    for(let i = 0 ; i < this.listaHistorial.length; i++)
    {
      if((this.listaHistorial[i].paciente.id == this.db.idPaciente)  && (this.listaHistorial[i].turno.especialidad.toUpperCase() == this.especialidadSeleccionada.toUpperCase()))
      {
        historialEncontrado.push(this.listaHistorial[i]);
      }
    }

    if(!(historialEncontrado.length > 0))
    {
      this.sinHistorial = true; 
    }

    return historialEncontrado;
  }
}
