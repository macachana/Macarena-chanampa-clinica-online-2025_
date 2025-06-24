import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../clases/usuario';
import { Router, RouterLink } from '@angular/router';
import { Especialista } from '../../clases/especialista';
import { Paciente } from '../../clases/paciente';

// import de generar excel
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  db = inject(DatabaseService);
  router = inject(Router);

  listaUsuarios: Usuario[] = [];
  
  listaEspecialistas: Especialista[] = [];
  listaPacientes: Paciente[] = [];
  listaHistorial: any[] = [];


  ngOnInit()
  {
    this.db.listarUsuarios().then((usuarios: Usuario[]) => {
      this.listaUsuarios = usuarios;
    });
    this.db.listarEspecialistas().then((especialistas: Especialista[])=>{
      this.listaEspecialistas = especialistas;
    });

    this.db.listarPacientes().then((pacientes: Paciente[])=>{
      this.listaPacientes = pacientes;
    });

    this.db.listarHistorial().then((historial: any[])=>{
      this.listaHistorial = historial;
    });
  }

  cambiarEstadoEspecialista(estado: string,email: string)
  {

    let estadoNuevo = "";
    if(estado == "deshabilitado")
    {
      estadoNuevo = "habilitado";
    }
    else
    {
      estadoNuevo = "deshabilitado";
    }
    const data = this.db.modificarEstado(estadoNuevo,email);
    setTimeout(()=>{
      this.ngOnInit();
    },500);
    console.log(data);
  }

  estadoBoolean(estado: string):boolean
  {
    if(estado == "habilitado")
    {
      return true;
    }
    return false;
  }

  verHistorialClinico(idPaciente: number | undefined)
  {
    this.db.mostrarHistorial = true;
    this.db.idPaciente = idPaciente;
    this.router.navigate(['/historial_clinico']);       
  }

  generarExcel()
  {
    let datos : any[] = [];

    for(let i = 0; i < this.listaUsuarios.length; i++)
    {
      datos.push({nombre: this.listaUsuarios[i].nombre,apellido: this.listaUsuarios[i].apellido,edad: this.listaUsuarios[i].edad, email: this.listaUsuarios[i].email, dni: this.listaUsuarios[i].dni, tipo_usuario: this.listaUsuarios[i].tipo});
    }

    // convertir 'datos' a hoja de excel
    let worksheet:XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);

    // crear el libro de excel
    let workbook:XLSX.WorkBook = {
      Sheets: {'Usuarios': worksheet },
      SheetNames: ['Usuarios']
    };

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

    FileSaver.saveAs(data, 'usuarios_clinica.xlsx');

  }

  tieneHistorial(pacienteId : number | undefined) : boolean
  {
    return this.listaHistorial.some(historial => historial.paciente.id === pacienteId);
  }
}
