import { Component } from '@angular/core';

@Component({
  selector: 'app-informes',
  imports: [],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent {

  graficos01 : boolean = false;
  graficos02 : boolean = false;
  graficos03 : boolean = false;
  graficos04 : boolean = false;
  mostrarLog : boolean = false;

  constructor()
  {

  }

  ngOnInit()
  {

  }

  mostrarLogs()
  {
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = false;
    this.mostrarLog = true;
  }

  mostrarGraficos01()
  {
    this.mostrarLog = false;
    this.graficos01 = true;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = false;
  }

  mostrarGraficos02()
  {
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = true;
    this.graficos03 = false;
    this.graficos04 = false;
  }

  mostrarGraficos03()
  {
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = true;
    this.graficos04 = false;
  }

  mostrarGraficos04()
  {
    this.mostrarLog = false;
    this.graficos01 = false;
    this.graficos02 = false;
    this.graficos03 = false;
    this.graficos04 = true;
  }
}
