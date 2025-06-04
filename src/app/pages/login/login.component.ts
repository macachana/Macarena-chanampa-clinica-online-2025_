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

  tipoUsuario : string = "";

  formularioEsp = new FormGroup({
    email: new FormControl('',{
      validators:[Validators.required, Validators.email]
    }), 
    contra: new FormControl('',{
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  ngOnInit()
  {
    
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
            timer: 3000
          });
          setTimeout(()=>{
            this.router.navigate(["/home"]);
          },1500);
        }else
        {
          Swal.fire({
            position: "top",
            icon: "error",
            title: "Ups. usuario no registrado vuelva a intentarlo.",
            showConfirmButton: false,
            timer: 3000
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
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
    }
  }

}
