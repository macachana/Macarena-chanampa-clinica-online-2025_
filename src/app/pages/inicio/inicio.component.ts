import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { trigger, transition, style, animate, query, animateChild, group, state, keyframes } from '@angular/animations';

@Component({
  selector: 'app-inicio',
  imports: [RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0.3 })),
      transition('in => out', animate('500ms ease-in')),
      transition('out => in',animate('800ms ease-out'))
    ])
  ]
})
export class InicioComponent {
  router = inject(Router);
  db = inject(DatabaseService);

  fadeState = 'in';
  fadeState02 = 'in';
  slideState = 'out';
  expandState = 'collapsed';
  staggerState = 'bounced';
  rotateState = 'rotated';
  zoomState = 'zoomed';
  flipState = 'normal';
  shakeState = 'normal';
  pulseState = 'normal';
  showView = true;

  irAinicio()
  {
    this.db.mostrarSpinner = true;
    setTimeout(()=>{
      this.router.navigate(['/login']);
      this.db.mostrarSpinner = false;
    },2000);
  }

  irAregistro()
  {
    this.db.mostrarSpinner = true;
    setTimeout(()=>{
      this.router.navigate(['/registro']);
      this.db.mostrarSpinner = false;
    },2000);
  }

  onMouseEnter(animation : string,numberButton: number = 1)
  {
    switch(animation)
    {
      case 'fade':
        if(numberButton == 1)
        {
          this.fadeState = 'out';
        }
        else
        {
          this.fadeState02 = 'out';
        }
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

  onMouseLeave(animation : string, numberButton: number = 1)
  {
    switch(animation)
    {
      case 'fade':
        if(numberButton == 1)
        {
          this.fadeState = 'in';
        }
        else
        {
          this.fadeState02 = 'in';
        }
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
