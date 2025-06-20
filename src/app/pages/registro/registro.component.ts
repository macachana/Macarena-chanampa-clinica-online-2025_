import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { trigger, transition, style, animate, query, animateChild, group, state, keyframes } from '@angular/animations';

@Component({
  selector: 'app-registro',
  imports: [RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
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
            animate('3000ms ease-out',
            style({ left: '-100%',
            opacity: 0 }))
          ], {optional: true}),
          query(':enter', [
            animate('1500ms ease-out',
            style({ left: '0%', opacity: 
              1 }))
          ], { optional: true })
        ]),
        query(':enter', animateChild(), {
        optional: true }),
      ])
    ])
  ]
})
export class RegistroComponent {
  db = inject(DatabaseService);
  router = inject(Router);

  fadeState = 'out';
  slideState = 'out';
  expandState = 'collapsed';
  staggerState = 'bounced';
  rotateState = 'rotated';
  zoomState = 'zoomed';
  flipState = 'normal';
  shakeState = 'normal';
  pulseState = 'normal';
  showView = true;

  prepareRoute(outlet: RouterOutlet)
  {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  
  irAregistroESP()
  {
    // /registros/registro-especialista
    this.router.navigate(['/registros/registro-especialista']);
  }

  irAregistroPAC()
  {
    // /registros/registro-paciente
    this.router.navigate(['/registros/registro-paciente']);
  }

  onMouseEnter(animation : string)
  {
    switch(animation)
    {
      case 'fade':
        this.fadeState = 'out';
        break;
      case 'slide':
        this.slideState = 'out';
        break;
      case 'expand':
        this.expandState = 'collapsed';
        break;
      case 'stagger':
        this.staggerState = 'bounced';
        break;
      case 'rotate':
        this.rotateState = 'rotated';
        break;
      case 'zoom':
        this.zoomState = 'zoomed';
        break;
      case 'flip':
        this.flipState = 'flipped';
        break;
      case 'shake':
        this.shakeState = 'shaking';
        break;
      case 'pulse':
        this.pulseState = 'pulsing';
        break;
    }
  }

  onMouseLeave(animation : string)
  {
    switch(animation)
    {
      case 'fade':
        this.fadeState = 'in';
        break;
      case 'slide':
        this.slideState = 'in';
        break;
      case 'expand':
        this.expandState = 'expanded';
        break;
      case 'stagger':
        this.staggerState = 'normal';
        break;
      case 'rotate':
        this.rotateState = 'normal';
        break;
      case 'zoom':
        this.zoomState = 'normal';
        break;
      case 'flip':
        this.flipState = 'normal';
        break;
      case 'shake':
        this.shakeState = 'normal';
        break;
      case 'pulse':
        this.pulseState = 'normal';
        break;
    }
  }

}
