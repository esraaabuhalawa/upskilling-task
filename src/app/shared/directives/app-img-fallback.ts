import { Directive, HostListener, Input } from '@angular/core';
import { APP_CONFIG } from '../../core/constants/app.constants';

@Directive({
  selector: '[appAppImgFallback]'
})
export class AppImgFallback {

  constructor() { }
  @Input() fallbackSrc: string = APP_CONFIG.IMAGES.PLACEHOLDER_URL;

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackSrc;
  }
}
