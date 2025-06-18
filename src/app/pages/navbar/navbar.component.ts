import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  db = inject(DatabaseService);
  auth = inject(AuthService);

  router = inject(Router);
  tipoUsuario : string = "";
  bloqueo : boolean = true;

  ngOnInit()
  {
  }

  cerrarSesion()
  {
    this.db.mostrarSpinner = false;
    this.db.mostrarSegundoSpinner = true;
    setTimeout(()=>{
      this.auth.cerrarSesion();
      this.router.navigate(['/inicio']);
      this.db.tipoUsuario = "";
      this.db.mostrarSegundoSpinner = false;
    },2000);
  }

  redirigir(ruta: string, tipoSpinner: number = 1)
  {
    if(tipoSpinner == 1)
    {
      this.db.mostrarSpinner = true;
      setTimeout(()=>{
        this.router.navigate([ruta]);
        this.db.mostrarSpinner = false;
      },2000);      
    }
    else if(tipoSpinner == 2)
    {
      this.db.mostrarSpinner = false;
      this.db.mostrarSegundoSpinner = true;
      setTimeout(()=>{
        this.router.navigate([ruta]);
        this.db.mostrarSegundoSpinner = false;
      },2000);     
    }
  }
}
