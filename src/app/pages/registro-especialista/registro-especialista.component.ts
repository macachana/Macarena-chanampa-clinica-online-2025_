import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
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
import {NgHcaptchaModule } from 'ng-hcaptcha';

// services
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

import Swal from 'sweetalert2';
import { Especialista } from '../../clases/especialista';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-registro-especialista',
  imports: [FormsModule,ReactiveFormsModule,RouterLink,NgHcaptchaModule],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css',
  standalone: true
})
export class RegistroEspecialistaComponent {

  // variables de hcaptcha
  robot : boolean = false;
  expirado : boolean = false;
  captchaToken: string | null = null;

  db = inject(DatabaseService);
  auth = inject(AuthService);
  storage = inject(StorageService);

  fotoChange : string = "";

  mensajeCaptcha : string = "";

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
    segundaEspecialidad: new FormControl('',{
      validators: [Validators.minLength(6),Validators.maxLength(30)]
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
    this.formularioEsp.statusChanges.subscribe((valor) => {
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
    if(this.formularioEsp.valid)
    {
      let especialista : Especialista;
      const {nombre ,apellido ,edad ,dni ,especialidad ,segundaEspecialidad,email ,clave ,foto} = this.formularioEsp.value;
      
      if(nombre && apellido && edad && dni && especialidad && email && clave && foto)
      {
        const usuario : Usuario = new Usuario(nombre,apellido,parseInt(edad),email,parseInt(dni),"especialista");
        if(segundaEspecialidad)
        {
          especialista = new Especialista(nombre,apellido,parseInt(edad),email,parseInt(dni),this.fotoChange,this.toTitleCase(especialidad),this.toTitleCase(segundaEspecialidad),"deshabilitado");
        }else
        {
          especialista = new Especialista(nombre,apellido,parseInt(edad),email,parseInt(dni),this.fotoChange,this.toTitleCase(especialidad),null,"deshabilitado");
        }

        if(this.captchaToken != null)
        {
          this.storage.guardarImagenEspecialista(this.fotoChange,nombre + "_Especialista");
          this.auth.crearCuenta(email,clave,nombre,apellido,parseInt(dni),"especialista");
          this.db.crearUsuario(usuario);
          this.db.crearEspecialista(especialista);
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Especialista registrado. Ahora espere a ser habilitado por administración.",
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
            title: "ERROR CON EL CAPTCHA.",
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

  toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
  }

  clearForm()
  {
   this.formularioEsp.reset(); 
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
