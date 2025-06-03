import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { 
  AbstractControl,
  FormControl, 
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
 } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-especialista',
  imports: [FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent {

  formularioEsp = new FormGroup({
    nombre: new FormControl('',{
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(35)]
    }), 
    apellido: new FormControl('',{
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(35)]
    }),
    edad: new FormControl('',{
      validators: [Validators.required, Validators.min(25), Validators.max(70), Validators.pattern(/^\d{2}$/)]
    }),
    dni: new FormControl('',{
      validators: [Validators.required, Validators.pattern(/^\d{7,8}$/)]
    }),
    especialidad: new FormControl('',{
      validators: [Validators.required, Validators.minLength(6),Validators.maxLength(30)]
    }),
    email: new FormControl('',{
      validators: [Validators.required, Validators.email]
    }),
    clave: new FormControl('',{
      validators: [Validators.required, Validators.minLength(6)]
    }),
    confirmaClave: new FormControl('',{
      validators: [Validators.required]
    }),
    imagenPerfil: new FormControl('',{
      validators: [Validators.required]
    })
  }, {validators: this.verificarConfirmacionClave });

  ngOnInit() {
    this.formularioEsp.statusChanges.subscribe((valor) => {
      console.log(valor);
    });
  }

  verificarConfirmacionClave(group: AbstractControl): ValidationErrors | null
  {
    const clave = group.get('clave')?.value;
    const confirmaClave = group.get('confirmaClave')?.value;
      console.log("clave: " + clave);
      console.log("confirmacion: " + confirmaClave);
      
      if(clave && confirmaClave && clave !== confirmaClave)
        return {noConfirmacion: true};

      return null;
  }

  enviar()
  {
    if(this.formularioEsp.valid)
    {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Especialista registrado. Ahora espere a ser habilitado por administración.",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else
    {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Ups. Parece que a ocurrido un error en el registro, vuelva a intentarlo.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
}
