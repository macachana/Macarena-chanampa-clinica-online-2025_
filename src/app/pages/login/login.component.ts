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
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// importación de h captcha
// import { NgHcaptchaModule } from 'ng-hcaptcha';

//
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NgHcaptchaModule } from 'ng-hcaptcha';

@Component({
  selector: 'app-login',
  imports: [FormsModule,ReactiveFormsModule,NgHcaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent{

  // variables de hcaptcha
  robot : boolean = false;
  expirado : boolean = false;
  captchaToken: string | null = null;

  mensajeCaptcha : string = "";

  emailIng = "";
  claveIng = "";

  router = inject(Router);

  db = inject(DatabaseService);
  auth = inject(AuthService);
  storage = inject(StorageService);

  tipoUsuario : string = "";

  formularioLogin = new FormGroup({
    email: new FormControl('',{
      validators:[Validators.required, Validators.email]
    }), 
    contra: new FormControl('',{
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  constructor()
  {
    this.emailIng = "";
    this.claveIng = "";
  }

  ngOnInit()
  {
    this.emailIng = "";
    this.claveIng = "";
    // console.log(this.storage.buscarImagenEmail("Martina", 12589635));
  }

  async enviar()
  {
    // traemos de la tabla usuarios_clinica el usuario que coincida con el email ingresado.
    const { data, error } = await this.db.supabase.from("usuarios_clinica").select("*").eq("email",this.emailIng);
    
    console.log(data);
    if(this.captchaToken == null)
    {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "ERROR CON EL CAPTCHA",
        showConfirmButton: false,
        timer: 1000
      });
    }
    else
    {

      if(data != null)
      {
          this.db.tipoUsuario = data[0].tipo;
          
          console.log("Tipo de usuario:" + this.db.tipoUsuario);
          if(this.db.tipoUsuario !== "especialista")
          {
            // ahora si el tipo no es "especialista", entonces ingresa como cualquier otro usuario.
            this.auth.iniciarSesion(this.emailIng,this.claveIng).then((resultado)=>{
            
              console.log(resultado);
  
              if(resultado.data.session != null)
              {
                Swal.fire({
                  position: "top",
                  icon: "success",
                  title: "Bienvenido/a " + data[0].nombre,
                  showConfirmButton: false,
                  timer: 1000
                });
                setTimeout(()=>{
                  this.router.navigate(["/home"]);
                  this.clearForm();
                  setTimeout(()=>{
                    this.emailIng = "";
                    this.claveIng = "";
                  },500);
                },1000);           
              }
              });
          }
          else
          {
            // en el caso de que el usuario es de tipo especialista, consultamos la tabla de especialistas, y buscamos el especialista con el email ingresado.
            const especialista = await this.db.supabase.from("especialistas").select("*").eq("email",this.emailIng);
  
            if(especialista.data !== null)
            {
              console.log(especialista.data);
              console.log("estado:" + especialista.data[0].estado);
              
              // si el estado del especialista es habilitado, se hace el proceso de inicio de sesion.
              if(especialista.data[0].estado == "habilitado")
              {
                this.auth.iniciarSesion(this.emailIng,this.claveIng).then((resultado)=>{
                  console.log(resultado);
                  if(resultado.data.session != null)
                  {
                    console.log("tipo de usuario:" + this.db.tipoUsuario);
                    Swal.fire({
                      position: "top",
                      icon: "success",
                      title: "Bienvenido/a " + data[0].nombre,
                      showConfirmButton: false,
                      timer: 1000
                    });
                    this.resetCaptcha();
                    setTimeout(()=>{
                      this.router.navigate(["/home"]);
                      this.clearForm();
                      setTimeout(()=>{
                        this.emailIng = "";
                        this.claveIng = "";
                      },500);
                    },1000);
                  }
                });
              }
              else
              {
                // si no está habilitado se muestra un mensaje indicando este caso.
                Swal.fire({
                  position: "top",
                  icon: "error",
                  title: "Error, no fue habilitado por administración, espere a ser habilitado...",
                  showConfirmButton: false,
                  timer: 3000
                });
                this.resetCaptcha();
              }
            }
          }
        }
        else
        {
          Swal.fire({
            position: "top",
            icon: "error",
            title: "¡VERIFIQUE QUE NO ES UN ROBOT!.",
            showConfirmButton: false,
            timer: 2000
          });
        }
    }
  }

  accesoDirecto(numeroAcceso: number)
  {
    switch(numeroAcceso)
    {
      case 1:
        this.emailIng = "mariaValle@gmail.com";
        this.claveIng = "125896";
        break;
      case 2:
        this.emailIng = "martina_punicedo@gmail.com";
        this.claveIng = "martina";        
        break;
      case 3:
        this.emailIng = "mariaChanampa_2025@gmail.com";
        this.claveIng = "mariaC";        
        break;
      case 4:
        this.emailIng = "armandoValenzuela45@gmail.com";
        this.claveIng = "armando";
        break;
      case 5:
        this.emailIng = "marianelaCampana25@gmail.com"
        this.claveIng = "marianela";
        break;
      case 6:
        this.emailIng = "roberto46.urizuru@gmail.com";
        this.claveIng = "roberto";
        break;
    }
  }

  imagenesAcceso(numeroAcceso : number) : string
  {
    let url : string = "";
    switch(numeroAcceso)
    {
      case 1:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/Mateo_48799566";
        break;
      case 2:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/Martina_12589635";
        break;
      case 3:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/Maria_45785869";
        break;
      case 4:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/especialistas/Armando_Doctor";
        break;
      case 5:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/especialistas/Marianela_Odontologia";
        break;
      case 6:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/administradores/Roberto_Urizuru";
        break;
    }
    return url;
  }

  clearForm()
  {
    this.formularioLogin.reset();
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
