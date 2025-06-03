import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-paciente',
  imports: [FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css'
})
export class RegistroPacienteComponent {
  formularioPac = new FormGroup({
    
  });

  enviar()
  {
    
  }
}
