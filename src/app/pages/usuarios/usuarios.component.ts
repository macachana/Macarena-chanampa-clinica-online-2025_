import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../clases/usuario';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  db = inject(DatabaseService);
  listaUsuarios: Usuario[] = [];
  habilitado = true;
  ngOnInit()
  {
    this.db.listarUsuarios().then((usuarios: Usuario[]) => {
      this.listaUsuarios = usuarios;
      console.log(this.listaUsuarios);
    });
  }

  cambiarEstadoEspecialista()
  {
    this.habilitado = !this.habilitado;
  }
}
