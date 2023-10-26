import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeHr from '@angular/common/locales/hr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Function for handling locale registration
 */
export function initLocale(): void {
  registerLocaleData(localeHr, 'hr');
}

/**
 * Factory for creating new JSON file translation loader object
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/core/', '.json');
}
