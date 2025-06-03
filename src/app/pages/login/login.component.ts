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
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formularioEsp = new FormGroup({
    email: new FormControl('',{
      validators:[Validators.required, Validators.email]
    }), 
    contra: new FormControl('',{
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  enviar()
  {
    
  }

}
