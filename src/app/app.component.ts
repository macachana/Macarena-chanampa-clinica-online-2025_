import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from "./pages/navbar/navbar.component";

import { NgHcaptchaModule } from 'ng-hcaptcha';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbCollapseModule, NavbarComponent,NgHcaptchaModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isCollapsed = false;
  router = inject(Router);

  title = 'Clinica-Online';
}
