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
import { DatabaseService } from '../../services/database.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
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
    const {data, error} = await this.db.supabase.from("usuarios_clinica").select("*").eq("email",this.emailIng);
    if(data != null)
    {
      this.db.tipoUsuario = data[0].tipo;


      this.auth.iniciarSesion(this.emailIng,this.claveIng).then((resultado)=>{
        if(resultado.data.session != null)
        {
          console.log("tipo de usuario:" + this.db.tipoUsuario);
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Bienvenido " + data[0].nombre,
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
        }else
        {
          Swal.fire({
            position: "top",
            icon: "error",
            title: "Ups. usuario no registrado vuelva a intentarlo.",
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
    }
  }

  accesoDirecto(numeroAcceso: number)
  {
    switch(numeroAcceso)
    {
      case 1:
        this.emailIng = "";
        this.claveIng = "";
        // (<HTMLImageElement>document.getElementById("fotoU01")).src = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/";
        break;
      case 2:
        this.emailIng = "martina_punicedo@gmail.com";
        this.claveIng = "martina";        
        // (<HTMLImageElement>document.getElementById("fotoU02")).src = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/Martina_12589635";
        break;
      case 3:
        this.emailIng = "mariaChanampa_2025@gmail.com";
        this.claveIng = "mariaC";        
        // (<HTMLImageElement>document.getElementById("fotoU03")).src = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/Maria_45785869";
        break;
      case 4:
        this.emailIng = "";
        this.claveIng = "";
        // (<HTMLImageElement>document.getElementById("fotoU04")).src = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/especialistas/";
        break;
      case 5:
        this.emailIng = "marianela.campana22@gmail.com"
        this.claveIng = "marianela";
        // (<HTMLImageElement>document.getElementById("fotoU05")).src = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/especialistas/Marianela";
        break;
      case 6:
        this.emailIng = "roberto.urizurus@gmail.com";
        this.claveIng = "roberto";
        // (<HTMLImageElement>document.getElementById("fotoU06")).src = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/administradores/Roberto_Urizurus";
        break;
    }
  }

  imagenesAcceso(numeroAcceso : number) : string
  {
    let url : string = "";
    switch(numeroAcceso)
    {
      case 1:
        url = "";
        break;
      case 2:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/Martina_12589635";
        break;
      case 3:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/Maria_45785869";
        break;
      case 4:
        url = "";
        break;
      case 5:
        url = "";
        break;
      case 6:
        url = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/administradores/Roberto_Urizurus";
        break;
    }
    return url;
  }

  clearForm()
  {
    this.formularioLogin.reset();
  }

}
