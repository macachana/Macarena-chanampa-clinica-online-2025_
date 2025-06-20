import { Component, inject } from '@angular/core';
import { DatePipe, TitleCasePipe, LowerCasePipe, registerLocaleData, UpperCasePipe } from '@angular/common';
import { DatabaseService } from '../../services/database.service';

import localeEs from '@angular/common/locales/es';
import { BrowserModule } from '@angular/platform-browser';

import { trigger, transition, style, animate, query, animateChild, group, state, keyframes } from '@angular/animations';

// import de generar excel
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

// import de generar PDF
import { jsPDF } from 'jspdf';

// imports de graficos
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-informes',
  imports: [DatePipe, TitleCasePipe, LowerCasePipe, UpperCasePipe],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css',
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ transform: 'scale(1)'})),
      state('collapsed', style({ transform: 'scale(0.8)'})),
      transition('expanded => collapsed', animate('300ms ease-in')),
      transition('collapsed => expanded', animate('300ms ease-out'))
    ])
  ]
})
export class InformesComponent {

  titulo = "lista de ingresos al sistema";

  graficos01 : boolean = false;
  graficos02 : boolean = false;
  graficos03 : boolean = false;
  graficos04 : boolean = false;
  mostrarLog : boolean = false;

  db = inject(DatabaseService);
  listaLogs : any[] = [];

  expandState = 'collapsed';
  expandState02 = 'collapsed';

  constructor()
  {
    this.db.listarLogs().then((logs : any[])=>{
      this.listaLogs = logs;
      console.log(this.listaLogs);
    }); 
  }

  ngOnInit()
  {

  }

  mostrarLogs()
  {
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = false;
    this.mostrarLog = true;
  }

  mostrarGraficos01()
  {
    this.mostrarLog = false;
    this.graficos01 = true;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = false;
  }

  mostrarGraficos02()
  {
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = true;
    this.graficos03 = false;
    this.graficos04 = false;
  }

  mostrarGraficos03()
  {
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = true;
    this.graficos04 = false;
  }

  mostrarGraficos04()
  {
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = true;
  }

  generarExcel()
  {
    // let datos : any[] = [];

    // for(let i = 0; i < this.listaUsuarios.length; i++)
    // {
    //   datos.push({nombre: this.listaUsuarios[i].nombre,apellido: this.listaUsuarios[i].apellido,edad: this.listaUsuarios[i].edad, email: this.listaUsuarios[i].email, dni: this.listaUsuarios[i].dni, tipo_usuario: this.listaUsuarios[i].tipo});
    // }

    // // convertir 'datos' a hoja de excel
    // let worksheet:XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);

    // // crear el libro de excel
    // let workbook:XLSX.WorkBook = {
    //   Sheets: {'Usuarios': worksheet },
    //   SheetNames: ['Usuarios']
    // };

    // // convertimos el libro en un buffer
    // let excelBuffer: any = XLSX.write(
    //   workbook, {
    //     bookType: 'xlsx',
    //     type: 'array',
    //   }
    // );

    // // Guardar el archivo
    // let data: Blob = new Blob([excelBuffer], {
    //   type: 'application/octet-stream'
    // });

    // FileSaver.saveAs(data, 'usuarios_clinica.xlsx');

  }

  generarPDF()
  {
    // if(historialIngresado)
    // {
    //   // console.log(this.listaHistorial[historialIngresado]);

    //   let historialClinico: any = {};
    
    //   const doc = new jsPDF();
  
    //   for(let i = 0; i < this.listaHistorial.length; i++)
    //   {
    //     if(this.listaHistorial[i].turno.id == historialIngresado)
    //     {
    //       historialClinico = this.listaHistorial[i];
    //       console.log(historialClinico);
    //     }
    //   }

    //   let titulo = "Historial médico: " + historialClinico.turno.fecha + ' - ' + historialClinico.turno.horario + ' hs';  

    //   let logo = 'https://i.postimg.cc/59z68LyS/55-sin-t-tulo-1.png';

    //   let lineas : string[] = [
    //     'PACIENTE: ' + historialClinico.paciente.nombre + ' ' + historialClinico.paciente.apellido,
    //     '',
    //     'ESPECIALISTA: ' + historialClinico.turno.especialista.nombre + ' ' + historialClinico.turno.especialista.apellido,
    //     '',
    //     'ESPECIALIDAD: ' + historialClinico.turno.especialidad,
    //     '',
    //     'ALTURA: ' + historialClinico.altura,
    //     '',
    //     'PESO: ' + historialClinico.peso,
    //     '',
    //     'TEMPERATURA: ' + historialClinico.temperatura,
    //     '',
    //     'PRESIÓN: ' + historialClinico.presion,
    //   ];

    //   for(let clave of this.obtenerClaves(historialClinico.datoDinamico))
    //   {
    //     lineas.push('');
    //     lineas.push(clave.toUpperCase() + ': ' + historialClinico.datoDinamico[clave]);
    //   }

    //   console.log(lineas);

    //   this.convertirImagenUrlABase64(logo).then((imagenBase64) => {
    //       // Agregar título
    //       doc.setFontSize(30);
    //       doc.setFont('Arial','normal','bold');
    //       doc.text(titulo, 20, 20);

    //       // Agregar imagen
    //       doc.addImage(imagenBase64, 'PNG', 80, 30, 60, 60); // (img, tipo, x, y, width, height)

    //       // Texto con salto de línea
    //       doc.setFontSize(20);
    //       doc.setFont('Arial','normal','bold');
    //       doc.text(lineas, 20, 120); // x = 20, y = 100 (esto hara que el texto quede debajo de la imagen)

    //       // Guardar el PDF
    //       doc.save('historial_medico_' + historialClinico.paciente.nombre.toLowerCase() + '_' + historialClinico.paciente.apellido.toLowerCase() + '.pdf');
    //   });
    // }
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

  horaModificada(hora: string) : string
  {
    return hora.split(":")[0] + ':' + hora.split(":")[1];
  }

  async crearGrafico()
  {
    // if(!this.graficoCanvas) return;

    // const ctx = this.graficoCanvas.nativeElement.getContext('2d');

    // const imagenesFiltradas = this.imagenes.filter(img => img.cantidad_likes > 0);

    // const labels = imagenesFiltradas.map(img => `${img.cantidad_likes}`);
    // const data = imagenesFiltradas.map(img => img.cantidad_likes);

    // new Chart(ctx, {
    //     type: 'pie',
    //     data: {
    //       labels: labels,
    //       datasets: [{
    //         data: data,
    //         backgroundColor: [
    //           '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800',
    //           '#BA68C8', '#81C784', '#F06292', '#9575CD', '#90CAF9'
    //         ],
    //       }]
    //     },
    //     options: {
    //       responsive: true,
    //       plugins: {
    //         datalabels: {
    //           color: 'black',
    //           formatter: (value,context) => labels[context.dataIndex],
    //           font: {
    //             weight: 'bold',
    //             size: 20,
    //           }
    //         },
    //         legend: {
    //           position: 'bottom'
    //         }
    //       },
    //       onClick: (event, elements) => {
    //         if (elements.length > 0) {
    //           const index = elements[0].index;
    //           const imagen = imagenesFiltradas[index];
    //           this.imagenSeleccionadaUrl = imagen.url;
    //         }
    //       }
    //     },
    //     plugins: [ChartDataLabels]
    //   });
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

  volver()
  {
      this.graficos01 = false;
      this.graficos02 = false;
      this.graficos03 = false;
      this.graficos04 = false;
      this.mostrarLog = false;
  }
}
