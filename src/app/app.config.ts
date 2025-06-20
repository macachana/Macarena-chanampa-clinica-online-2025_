import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CaptchaConfig, CAPTCHA_CONFIG } from 'ng-hcaptcha';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {LOCALE_ID } from '@angular/core';

const hcaptchaSettings: CaptchaConfig = {
  siteKey: '94b8cc4a-8d70-4460-b110-43b0f5b062cc'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideAnimations(),
    provideRouter(routes),
    { provide: CAPTCHA_CONFIG, useValue: hcaptchaSettings},
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
