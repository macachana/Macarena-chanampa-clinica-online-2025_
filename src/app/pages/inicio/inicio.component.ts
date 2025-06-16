import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  router = inject(Router);
  db = inject(DatabaseService);

  irAinicio()
  {
    this.db.mostrarSpinner = true;
    setTimeout(()=>{
      this.router.navigate(['/login']);
      this.db.mostrarSpinner = false;
    },2000);
  }

  irAregistro()
  {
    this.db.mostrarSpinner = true;
    setTimeout(()=>{
      this.router.navigate(['/registro']);
      this.db.mostrarSpinner = false;
    },2000);
  }
}
