import { Component, inject } from '@angular/core';
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

// services
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

import Swal from 'sweetalert2';
import { Especialista } from '../../clases/especialista';
import { Usuario } from '../../clases/usuario';
import { Administrador } from '../../clases/administrador';

@Component({
  selector: 'app-registro-administrador',
  imports: [FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './registro-administrador.component.html',
  styleUrl: './registro-administrador.component.css'
})
export class RegistroAdministradorComponent {
  db = inject(DatabaseService);
  auth = inject(AuthService);
  storage = inject(StorageService);

  fotoChange : string = "";

  formularioAdm = new FormGroup({
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
    email: new FormControl('',{
      validators: [Validators.required, Validators.email]
    }),
    clave: new FormControl('',{
      validators: [Validators.required, Validators.minLength(6)]
    }),
    confirmaClave: new FormControl('',{
      validators: [Validators.required]
    }),
    foto: new FormControl('',{
      validators: [Validators.required]
    })
  }, {validators: this.verificarConfirmacionClave });

  ngOnInit() {
    this.formularioAdm.statusChanges.subscribe((valor) => {
      console.log(valor);
    });
  }

  verificarConfirmacionClave(group: AbstractControl): ValidationErrors | null
  {
    const clave = group.get('clave')?.value;
    const confirmaClave = group.get('confirmaClave')?.value;
      
      if(clave && confirmaClave && clave !== confirmaClave)
        return {noConfirmacion: true};

      return null;
  }

  onCambioDeArchivo(evento : any)
  {
    const archivo = evento.target.files[0];
    this.fotoChange = archivo;
  }

  enviar()
  {
    if(this.formularioAdm.valid)
    {
      const {nombre ,apellido ,edad ,dni ,email ,clave ,foto} = this.formularioAdm.value;
      
      if(nombre && apellido && edad && dni && email && clave && foto)
      {
        const usuario : Usuario = new Usuario(nombre,apellido,parseInt(edad),email,parseInt(dni),"administrador");
        const administrador : Administrador = new Administrador(nombre,apellido,parseInt(edad),email,parseInt(dni),this.fotoChange);

        this.storage.guardarImagenAdministrador(this.fotoChange,nombre + "_" + apellido);
        this.auth.crearCuenta(email,clave,nombre,apellido,parseInt(dni),"administrador");
        this.db.crearUsuario(usuario);
        this.db.crearAdministrador(administrador);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Administrador registrado.",
          showConfirmButton: false,
          timer: 2000
        });
        this.clearForm();
      }

    }
    else
    {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Ups. Parece que a ocurrido un error en el registro, vuelva a intentarlo.",
        showConfirmButton: false,
        timer: 2500
      });
    }
  }

  clearForm()
  {
   this.formularioAdm.reset(); 
  }
}
