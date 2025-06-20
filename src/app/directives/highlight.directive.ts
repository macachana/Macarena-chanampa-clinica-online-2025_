import { Directive, inject, Input, input } from '@angular/core';
import { ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  element: ElementRef<HTMLElement> = inject(ElementRef);

  @Input() appHighlight = 'yellow';

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar(this.appHighlight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar('');
  }

  resaltar(color: string) {
    this.element.nativeElement.style.backgroundColor = color;
  }

  constructor() {
  }

}
