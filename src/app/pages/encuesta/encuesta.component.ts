import { Component, inject } from '@angular/core';

import { DatabaseService } from '../../services/database.service';
import { Router, RouterLink } from '@angular/router';

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
  selector: 'app-encuesta',
  imports: [FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  listaComentarios : any[] = [];

  comentario : string = "";

  constructor()
  {
    this.db.listarComentarios().then((comentarios: any[])=>{
    this.listaComentarios = comentarios;
    });
  }

  ngOnInit()
  {
    this.db.listarComentarios().then((comentarios: any[])=>{
    this.listaComentarios = comentarios;
    });
  }

  agregarComentario()
  {
    const idUsuario : number = this.db.idUsuarioIng;
    const idTurno : number = this.db.idTurno;
    const estadoNuevo : string = this.db.estadoNuevoCuestionario;

    this.db.agregarComentario(idUsuario,this.db.idTurno,this.comentario).then((data)=>{
      console.log(data);
      if(data == undefined)
      {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Comentario agregado con exito. Redirigiendo...",
          showConfirmButton: false,
          timer: 2000
        });

        this.db.cambiarEstadoTurno(estadoNuevo,this.db.idTurno);
        this.db.cambiarContieneComentario(this.db.idTurno);

        if(this.db.tipoUsuario == "administrador")
        {
          setTimeout(()=>{
            this.router.navigate(["/turnos"]);
          },2100);
        }
        else
        {
          setTimeout(()=>{
            this.router.navigate(["/mis_turnos"]);
          },2100);
        }
      }
      else
      {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error al agregar el comentario",
          showConfirmButton: false,
          timer: 2000
        });
      }
    });            
  }
}
