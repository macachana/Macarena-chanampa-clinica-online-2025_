import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  db = inject(DatabaseService);
  auth = inject(AuthService);

  router = inject(Router);
  tipoUsuario : string = "";

  ngOnInit()
  {
  }

  cerrarSesion()
  {
    this.auth.cerrarSesion();
    this.router.navigate(['/inicio']);
    this.db.tipoUsuario = "";
  }
}
