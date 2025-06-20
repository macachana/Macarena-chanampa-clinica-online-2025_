import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from "./pages/navbar/navbar.component";

import { NgHcaptchaModule } from 'ng-hcaptcha';
import { DatabaseService } from './services/database.service';

import { RouterOutlet, RouterModule, Router } from '@angular/router';
// import { trigger, transition, style, animate, query, animateChild, group, state, keyframes } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NgbCollapseModule, NavbarComponent,NgHcaptchaModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // animations: [
  //   trigger('slideTransition', [
  //     transition(':enter', [
  //       style({ transform: 'translateX(-100%)', opacity: 0}),
  //       animate('500ms ease-out', style({
  //         transform: 'translateX(0)',
  //         opacity: 0.3 }))
  //     ]),
  //     transition(':leave', [
  //       animate('500ms ease-in',style({
  //         transform: 'translateX(100%)',
  //         opacity: 0 }))
  //     ])
  //   ]),
  // ]
})
export class AppComponent {

  isCollapsed = false;
  router = inject(Router);
  db = inject(DatabaseService);

  // fadeState = 'out';
  // slideState = 'out';
  // expandState = 'collapsed';
  // staggerState = 'bounced';
  // rotateState = 'rotated';
  // zoomState = 'zoomed';
  // flipState = 'normal';
  // shakeState = 'normal';
  // pulseState = 'normal';
  // showView = true;

  
}
