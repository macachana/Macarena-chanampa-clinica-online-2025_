import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../clases/usuario';
import { RouterLink } from '@angular/router';
import { Especialista } from '../../clases/especialista';

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


  ngOnInit()
  {
    this.db.listarUsuarios().then((usuarios: Usuario[]) => {
      this.listaUsuarios = usuarios;
      console.log(this.listaUsuarios);
    });
    this.db.listarEspecialistas().then((especialistas: Especialista[])=>{
      this.listaEspecialistas = especialistas;
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
    },2000);
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
}
