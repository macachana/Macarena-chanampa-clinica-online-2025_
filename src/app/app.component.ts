import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from "./pages/navbar/navbar.component";

import { NgHcaptchaModule } from 'ng-hcaptcha';
import { DatabaseService } from './services/database.service';

import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { trigger, transition, style, animate, query, animateChild, group, state, keyframes } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NgbCollapseModule, NavbarComponent,NgHcaptchaModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '100%', opacity: 0 })
        ], {optional: true }),
        query(':leave', animateChild(), {
        optional: true }),
        group([
          query(':leave', [
            animate('500ms ease-out',
            style({ left: '-100%',
            opacity: 0 }))
          ], {optional: true}),
          query(':enter', [
            animate('500ms ease-out',
            style({ left: '0%', opacity: 
              1 }))
          ], { optional: true })
        ]),
        query(':enter', animateChild(), {
        optional: true }),
      ])
    ]),
  ]
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

  prepareRoute(outlet: RouterOutlet)
  {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  
}
