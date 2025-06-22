import { Component, inject, ViewChild,ElementRef } from '@angular/core';
import { DatePipe, TitleCasePipe, LowerCasePipe, registerLocaleData, UpperCasePipe } from '@angular/common';
import { DatabaseService } from '../../services/database.service';

import localeEs from '@angular/common/locales/es';
import { BrowserModule } from '@angular/platform-browser';

import { trigger, transition, style, animate, query, animateChild, group, state, keyframes } from '@angular/animations';

import {
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// import de generar excel
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

// import de generar PDF
import { jsPDF } from 'jspdf';

// imports de graficos
import { Chart } from 'chart.js';
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

  titulo = "";

  graficos01 : boolean = false;
  graficos02 : boolean = false;
  graficos03 : boolean = false;
  graficos04 : boolean = false;
  mostrarLog : boolean = false;

  @ViewChild('grafico01') graficoCanvas!: ElementRef;
  chart: Chart | null = null;

  db = inject(DatabaseService);
  listaLogs : any[] = [];
  listaTurnos : any[] = [];
  listaCantTurnos : any[] = [];

  expandState = 'collapsed';
  expandState02 = 'collapsed';
  expandState03 = 'collapsed';

  diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  meses: {[nombre: string]: number} = {
    'enero': 0,
    'febrero': 1,
    'marzo': 2,
    'abril': 3,
    'mayo': 4,
    'junio': 5,
    'julio': 6,
    'agosto': 7,
    'septiembre': 8,
    'octubre': 9,
    'noviembre': 10,
    'diciembre': 11    
  };
  conteoEspecialidades: { [especialidad: string]: number } = {};

  turnosSolicitados : any[] = [];
  turnosFinalizados: any[] = [];

  cantMinutosSeleccionado : number = 0;


  constructor()
  {
    this.db.listarLogs().then((logs : any[])=>{
      this.listaLogs = logs;
    }); 

    this.db.listarTurnos().then((turnos: any[])=>{
      this.listaTurnos = turnos;

      for(const turno of this.listaTurnos)
      {
        if(turno.estado === "solicitado")
        {
          this.turnosSolicitados.push(turno);
        }
        else if(turno.estado == "realizado")
        {
          this.turnosFinalizados.push(turno);
        }
      }
    });
  }

  mostrarLogs()
  {
    this.mostrarLog = true;
    this.titulo = "lista de ingresos al sistema";
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = false;
    this.expandState = 'collapsed';
  }

  mostrarGraficos01()
  {
    this.graficos01 = true;
    this.titulo = "Cantidad de turnos por especialidad";
    this.mostrarLog = false;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = false;
    setTimeout(()=>{
      this.crearGrafico();
    },500);
    this.expandState = 'collapsed';
    // this.crearGrafico();
  }

  mostrarGraficos02()
  {
    this.graficos02 = true;
    this.titulo = "Cantidad de turnos por día";
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos03 = false;
    this.graficos04 = false;
    setTimeout(()=>{
      this.crearGrafico(2);
    },500);
    this.expandState = 'collapsed';
  }

  mostrarGraficos03()
  {
    this.graficos03 = true;
    this.titulo = "Cantidad de turnos por médico en un lapso de tiempo";
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos04 = false;
    setTimeout(()=>{
      this.crearGrafico(3);
    },500);
    this.expandState = 'collapsed';
  }

  mostrarGraficos04()
  {
    this.graficos04 = true;
    this.titulo = "Cantidad de turnos finalizados por médico en un lapso de tiempo";
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = false;
    setTimeout(()=>{
      this.crearGrafico(4);
    },500);
    this.expandState = 'collapsed';
  }

  generarExcel(logs : boolean = true)
  {
    if(logs)
    {
      let datos : any[] = [];

      for(let log of this.listaLogs)
      {
        datos.push({id:log.id, usuario:log.usuario.nombre + " " + log.usuario.apellido, tipo:log.usuario.tipo, fecha:log.fecha, hora:log.hora});
      }

      // se convierte los 'datos' a una hoja de excel
      let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);

      // se crea el libro de excel
      let workbook:XLSX.WorkBook = {
        Sheets: {'Datos': worksheet},
        SheetNames: ['Datos']
      }

      // convertimos el libro en un buffer
      let excelBuffer: any = XLSX.write(
        workbook, {
          bookType: 'xlsx',
          type: 'array',
        }
      );

      // Guardar el archivo
      let data: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream'
      });

      FileSaver.saveAs(data, 'logs_sistema_clinica_chanampa.xlsx');

    }

  }

  generarPDF(logs: boolean = true)
  {
    if(logs)
    {

      const doc = new jsPDF();

      const titulo: string = "Registro de logs de usuarios al sistema";

      const logo: string = "https://i.postimg.cc/59z68LyS/55-sin-t-tulo-1.png";

      let lineas : string[] = [];

      for(let log of this.listaLogs)
      {
        lineas.push("Usuario: " + log.usuario.nombre + " " + log.usuario.apellido + " (" + log.usuario.tipo + ") | " + log.fecha + ":" + log.hora);
      }

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
          doc.text(lineas, 5, 100); // x = 5, y = 100 (esto hara que el texto quede debajo de la imagen)

          // Guardar el PDF
          doc.save('logs_sistema_clinica_chanampa.pdf');
      });
    }
    else
    {
      const canvas: any = document.getElementById('canva');

      if (!canvas) {
        console.error('No se encontró el canvas con ID "canva".');
        return;
      }

      const doc = new jsPDF();

      const imagenBase64 = canvas.toDataURL('image/png');

      let tituloPDF : string[] = [];

      tituloPDF.push("Gráfico de barras:");
      tituloPDF.push(this.titulo);

      let logo = 'https://i.postimg.cc/59z68LyS/55-sin-t-tulo-1.png';

      this.convertirImagenUrlABase64(logo).then((imagen) => {
          // Agregar título
          doc.setFontSize(30);
          doc.setFont('Arial','normal','bold');
          doc.text(tituloPDF, 30, 20);

          // Agregar imagen
          doc.addImage(imagen, 'PNG', 80, 40, 60, 60); // (img, tipo, x, y, width, height)

          doc.addImage(imagenBase64, 'PNG', 30, 120, 130,130);

          doc.save('grafico_ ' + tituloPDF + '.pdf');
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

  horaModificada(hora: string) : string
  {
    return hora.split(":")[0] + ':' + hora.split(":")[1];
  }

  obtenerDiaSemana(fechaStr: string): string | null
  {
    const partes = fechaStr.toLowerCase().split(' de ');
    if(partes.length !== 2) return null;

    const dia = parseInt(partes[0]);
    const nombreMes = partes[1];

    const mes = this.meses[nombreMes];

    if(isNaN(dia) || mes === undefined) return null;

    const anio = new Date().getFullYear();
    const fecha = new Date(anio, mes, dia);

    const diaSemana = fecha.getDay();

    return this.diasSemana[diaSemana];

  }

  minutosSeleccionados(cantMinutos: number)
  {
    this.cantMinutosSeleccionado = cantMinutos;
    if(cantMinutos == 30)
    {
      (<HTMLButtonElement>document.getElementById("30")).className = 'btn btn-danger';
      (<HTMLButtonElement>document.getElementById("60")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("90")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("120")).className = 'btn btn-warning';
    }
    else if(cantMinutos == 60)
    {
      (<HTMLButtonElement>document.getElementById("60")).className = 'btn btn-danger';
      (<HTMLButtonElement>document.getElementById("30")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("90")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("120")).className = 'btn btn-warning';
    }
    else if(cantMinutos == 90)
    {
      (<HTMLButtonElement>document.getElementById("90")).className = 'btn btn-danger';
      (<HTMLButtonElement>document.getElementById("30")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("60")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("120")).className = 'btn btn-warning';
    }
    else
    {
      (<HTMLButtonElement>document.getElementById("120")).className = 'btn btn-danger';
      (<HTMLButtonElement>document.getElementById("30")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("60")).className = 'btn btn-warning';
      (<HTMLButtonElement>document.getElementById("90")).className = 'btn btn-warning';
    }

    if(this.graficos03)
    {
      this.crearGrafico(3);
    }
    else if(this.graficos04)
    {
      this.crearGrafico(4);
    }
  }

  async crearGrafico(numberGrafic: number = 1)
  {

    if(!this.graficoCanvas)
    {
      console.error("graficoCanvas no definido");
      return;
    }

    const ctx = this.graficoCanvas.nativeElement.getContext('2d');

    if(numberGrafic == 1)
    {

      for(let i = 0; i < this.listaTurnos.length; i++)
      {
        if(!this.conteoEspecialidades[this.listaTurnos[i].especialidad])
        {
          this.conteoEspecialidades[this.listaTurnos[i].especialidad] = 0;
        }

        this.conteoEspecialidades[this.listaTurnos[i].especialidad]++;
      }

      console.log(this.conteoEspecialidades);

      const especialidades = Object.keys(this.conteoEspecialidades); // ['Cardiología', 'Pediatría']
      const cantidades = Object.values(this.conteoEspecialidades); // [3, 2]

      const data = {
        labels: especialidades,
        datasets: [
          {
            label: "cantidad de turnos:",
            data: cantidades,
            backgroundColor: [
              '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
            ]
          }
        ]
      };

      if(this.chart)
      {
        this.chart.destroy();
      }

      this.chart = new Chart( ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              color: 'black',
              font: {
                weight: 'bold',
                size: 20,
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        },
      });

    }
    else if(numberGrafic == 2)
    {
      const conteoDias : { [dia: string]: number } = {
        lunes: 0,
        martes: 0,
        miércoles: 0,
        jueves: 0,
        viernes: 0,
        sabado: 0
      };

      for(let turno of this.listaTurnos)
      {
        let diaSemana = this.obtenerDiaSemana(turno.fecha);
        if(diaSemana)
        {
          conteoDias[diaSemana]++;
        }
      }

      const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const cantidad = dias.map(d => conteoDias[d]);

      const data = {
        labels: dias,
        datasets: [
          {
            label: 'cantidad de turnos: ',
            data: cantidad,
            backgroundColor: [
              '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
            ]
          }
        ]
      };

      if(this.chart)
      {
        this.chart.destroy();
      }

      this.chart = new Chart( ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              color: 'black',
              font: {
                weight: 'bold',
                size: 20,
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        },
      });
    }
    else if(numberGrafic == 3)
    {
      console.log(this.turnosSolicitados);

      if(this.cantMinutosSeleccionado != 0)
      {
        const conteoPorDuracion : {[Especialista : string] : number} = {
  
        };
        for(const turnoSolicitado of this.turnosSolicitados)
        {
          if(parseInt(turnoSolicitado.duracion_minutos) == this.cantMinutosSeleccionado)
          {
            if(!conteoPorDuracion[turnoSolicitado.especialista.nombre])
            {
              conteoPorDuracion[turnoSolicitado.especialista.nombre] = 0;
            }
  
            conteoPorDuracion[turnoSolicitado.especialista.nombre] ++;
          }
        }

        console.log(conteoPorDuracion);

        const especialistas = Object.keys(conteoPorDuracion);

        const cantidades = Object.values(conteoPorDuracion);

        const data = {
          labels: especialistas,
          datasets: [
            {
              label: "cantidad de turnos:",
              data: cantidades,
              backgroundColor: [
                '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
              ]
            }
          ]
        };

       if(this.chart)
        {
          this.chart.destroy();
        }


        this.chart = new Chart( ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                color: 'black',
                font: {
                  weight: 'bold',
                  size: 20,
                }
              },
              legend: {
                position: 'bottom'
              }
            }
          },
        });
      }
    }
    else
    {
      console.log(this.turnosFinalizados);

      if(this.cantMinutosSeleccionado != 0)
      {
        const conteoPorDuracion02 : {[Especialista : string] : number} = {
  
        };
        for(const turnoFinalizado of this.turnosFinalizados)
        {
          if(parseInt(turnoFinalizado.duracion_minutos) == this.cantMinutosSeleccionado)
          {
            if(!conteoPorDuracion02[turnoFinalizado.especialista.nombre])
            {
              conteoPorDuracion02[turnoFinalizado.especialista.nombre] = 0;
            }
  
            conteoPorDuracion02[turnoFinalizado.especialista.nombre] ++;
          }
        }

        console.log(conteoPorDuracion02);

        const especialistas = Object.keys(conteoPorDuracion02); // ['Cardiología', 'Pediatría']

        const cantidades = Object.values(conteoPorDuracion02); // [3, 2]

        const data = {
          labels: especialistas,
          datasets: [
            {
              label: "cantidad de turnos:",
              data: cantidades,
              backgroundColor: [
                '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
              ]
            }
          ]
        };

        if(this.chart)
        {
          this.chart.destroy();
        }

        this.chart = new Chart( ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                color: 'black',
                font: {
                  weight: 'bold',
                  size: 20,
                }
              },
              legend: {
                position: 'bottom'
              }
            }
          },
        });
      }
    }

    // const ctx = this.graficoCanvas.nativeElement as HTMLCanvasElement;

    // if(!this.graficoCanvas) return;

    // const ctx = this.graficoCanvas.nativeElement.getContext('2d');

    // conteo de cantidad de turnos por especialidad
    
        // const imagenesFiltradas = this.imagenes.filter(img => img.cantidad_likes > 0);  
        // const labels = this.listaTurnos.map(img => `${img.}`);
        // const data = imagenesFiltradas.map(img => img.cantidad_likes);
    
        // new Chart(ctx, {
        //     type: 'pie',
        //     data: {
        //       labels: especialidades,
        //       datasets: [
        //         {
        //           label: 'Cantidad de turnos',
        //           data: cantidades,
        //           backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
        //         }
        //       ]
        //     },
        //     options: {
        //       responsive: true,
        //       plugins: {
        //         datalabels: {
        //           color: 'black',
        //           font: {
        //             weight: 'bold',
        //             size: 20,
        //           }
        //         },
        //         legend: {
        //           position: 'bottom'
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
    else if(numberButton == 2)
    {
      this.expandState02 = 'expanded';
    }
    else
    {
      this.expandState03 = 'expanded';
    }
  }

  onMouseLeave(numberButton: number = 1)
  {
    if(numberButton == 1)
    {
      this.expandState = 'collapsed';
    }
    else if(numberButton == 2)
    {
      this.expandState02 = 'collapsed';
    }
    else
    {
      this.expandState03 = 'collapsed';
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
