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

  pacientesAgregados : Set<String> = new Set<string>();
  listaTurnos: any[] = [];
  listaPacientes : Paciente[] = [];
  listaHistorial: any[] = [];

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
          if(!this.pacientesAgregados.has(turnos[i].paciente.email))
          {
            this.listaTurnos.push(turnos[i]);
            this.pacientesAgregados.add(turnos[i].paciente.email);
          }
        }
      }
    });

    this.db.listarHistorial().then((historial: any[])=>{
      this.listaHistorial = historial;
    });
  }

  tieneHistorial(pacienteId : number | undefined) : boolean
  {
    return this.listaHistorial.some(historial => historial.paciente.id === pacienteId);
  }

  verHistorialClinico(idPaciente: number | undefined)
  {
    this.db.idPaciente = idPaciente;
    this.db.mostrarHistorial = true;
    this.router.navigate(['/historial_clinico']);
  }
}
