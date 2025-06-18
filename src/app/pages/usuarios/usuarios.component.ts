import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../clases/usuario';
import { RouterLink } from '@angular/router';
import { Especialista } from '../../clases/especialista';
import { Paciente } from '../../clases/paciente';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  db = inject(DatabaseService);
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

  }
}
