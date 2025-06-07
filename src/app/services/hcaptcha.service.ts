import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HcaptchaService {
  public isBrowser  = false;
  platformId : object = inject(PLATFORM_ID);
  constructor() {
    if(isPlatformBrowser(this.platformId))
    {
      this.isBrowser = true;
    }
  }

  getToken(token: string): string {
    if  (this.isBrowser == true){
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'macarena-chanampa-clinica-online-20.vercel.app/registros/registro-pacientes' + token, false);
      xhr.send();
      const aux = JSON.parse(xhr.responseText);
      return  xhr.responseText ;
    } else {
      return 'false'
    }
  }
}
