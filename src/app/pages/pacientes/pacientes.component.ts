import { Component, inject } from '@angular/core';

import { DatabaseService } from '../../services/database.service';
import { Paciente } from '../../clases/paciente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pacientes',
  imports: [],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  listaTurnos : any[] = [];
  listaPacientes : Paciente[] = [];

  constructor()
  {

  }

  ngOnInit()
  {
    this.db.listarTurnos().then((turnos: any[])=>{
      for(let i = 0; i < turnos.length; i++)
      {
        if((turnos[i].especialista.email == this.db.emailUsuarioAct) && (turnos[i].estado == "realizado"))
        {
          this.listaTurnos.push(turnos[i]);
        }
      }
    });
  }


}
