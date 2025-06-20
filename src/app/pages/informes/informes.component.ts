import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

// import de generar excel
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

// import de generar PDF
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-informes',
  imports: [],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent {

  graficos01 : boolean = false;
  graficos02 : boolean = false;
  graficos03 : boolean = false;
  graficos04 : boolean = false;
  mostrarLog : boolean = false;

  constructor()
  {

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

  generarPDF(historialIngresado: number | undefined)
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
}
