import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import {NgHcaptchaModule } from 'ng-hcaptcha';

// services
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

import Swal from 'sweetalert2';
import { Paciente } from '../../clases/paciente';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-registro-paciente',
  imports: [FormsModule, ReactiveFormsModule,RouterLink,NgHcaptchaModule
  ],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css',
  standalone: true
})

export class RegistroPacienteComponent {

  // variables de hcaptcha
  robot : boolean = false;
  expirado : boolean = false;
  captchaToken: string | null = null;

  // services
  db = inject(DatabaseService);
  auth = inject(AuthService);
  storage = inject(StorageService);

  primeraFoto : string = "";
  segundaFoto : string = "";

  mensajeCaptcha : string = "";

  formularioPac = new FormGroup({
    nombre: new FormControl('',{
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(35)]
    }), 
    apellido: new FormControl('',{
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(35)]
    }),
    edad: new FormControl('',{
      validators: [Validators.required,Validators.max(100), Validators.pattern(/^\d{1,2}$/)]
    }),
    dni: new FormControl('',{
      validators: [Validators.required, Validators.pattern(/^\d{7,8}$/)]
    }),
    obraSocial: new FormControl('',{
      validators: [Validators.required, Validators.minLength(4),Validators.maxLength(30)]
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
    }),
    foto02: new FormControl('',{
      validators: [Validators.required]
    })
  }, {validators: this.verificarConfirmacionClave });

  ngOnInit() {
    this.formularioPac.statusChanges.subscribe((valor) => {
      console.log(valor);
    });
    // Esto hace que hCaptcha llame a `window.onCaptchaSuccess` al validar
    (window as any).onCaptchaSuccess = (token: string) => {
      this.captchaToken = token;
    };
  }

  verificarConfirmacionClave(group: AbstractControl): ValidationErrors | null
  {
    const clave = group.get('clave')?.value;
    const confirmaClave = group.get('confirmaClave')?.value;
      
    if(clave && confirmaClave && clave !== confirmaClave)
      return {noConfirmacion: true};

    return null;
  }

  onCambioDeArchivo(evento : any, numero : number)
  {
    if(numero == 1)
    {
      const archivo = evento.target.files[0];
      this.primeraFoto = archivo;
    }
    else
    {
      const archivo = evento.target.files[0];
      this.segundaFoto = archivo;      
    }
  }


  enviar()
  {
    if(this.formularioPac.valid)
    {
      const { nombre, apellido, edad, email, dni, foto, foto02, obraSocial,clave} = this.formularioPac.value;
      
      if(nombre && apellido && edad && email && dni && foto && foto02 && obraSocial && clave)
      {
        const paciente : Paciente = new Paciente(nombre,apellido,parseInt(edad),email,parseInt(dni),this.primeraFoto,this.segundaFoto,obraSocial);
        const usuario : Usuario = new Usuario(nombre,apellido,parseInt(edad),email,parseInt(dni),"paciente");
        
        if(this.captchaToken != null)
        {
          this.storage.guardarImagenPaciente(this.primeraFoto,nombre + "_" + dni);
          this.storage.guardarImagenPaciente(this.segundaFoto,nombre + "_" + dni + "_02");
          this.auth.crearCuenta(email,clave,nombre,apellido,parseInt(dni),"paciente");
          this.db.crearUsuario(usuario);
          this.db.crearPacientes(paciente);
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Paciente registrado.",
            showConfirmButton: false,
            timer: 2000
          });
          this.resetCaptcha();
          this.clearForm();
        }
        else
        {
          Swal.fire({
            position: "top",
            icon: "error",
            title: "ERROR con el captcha.",
            showConfirmButton: false,
            timer: 2000
          });
          this.resetCaptcha();
        }
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
    this.formularioPac.reset();
  }

  //////////////////////// HCAPTCHA //////////////////////////

  onCaptchaSuccess(token: string): void {
    this.captchaToken = token;
    this.robot = true;
    this.expirado = false;
    this.mensajeCaptcha = "Captcha verificado ✅";
    // console.log("Captcha verificado: ", token);
  }

  onCaptchaExpired(): void {
    this.captchaToken = null;
    this.expirado = true;
    this.mensajeCaptcha = "Captcha expirado";
    setTimeout(()=>{
      this.mensajeCaptcha = "";
    },3000);
  }

  resetCaptcha() {
    const captchaWidget = (window as any).hcaptcha;
    if (captchaWidget) captchaWidget.reset();
    this.captchaToken = null;
    this.mensajeCaptcha = "";    
  }
}
