import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { enableElfProdMode } from '@ngneat/elf';
import { devTools } from '@ngneat/elf-devtools';
import { appConfig } from './app.config';
import { AppComponent } from './app/layout/app.component';
import { initLocale } from './app/utils/init-locale';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  enableElfProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    initLocale();
    devTools();
  })
  .catch((err) => console.error(err));
