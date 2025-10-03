import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeuix/themes/material';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { createInterceptorCondition, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, IncludeBearerTokenCondition, includeBearerTokenInterceptor, provideKeycloak } from 'keycloak-angular';
import { AppConfig } from './services/configuration.service';


export const getAppConfig = (appConfig: AppConfig): ApplicationConfig => {
  const pattern = new RegExp(`^(${appConfig.api.host})(/.*)?$`, "i");
  const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: pattern,
    bearerPrefix: 'Bearer'
  });

  return {
    providers: [
      provideAnimationsAsync(),
      providePrimeNG({
        theme: {
          preset: Material
        }
      }),
      provideBrowserGlobalErrorListeners(),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
      provideKeycloak({
        config: {
          url: appConfig.keycloak.host,
          realm: appConfig.keycloak.realm,
          clientId: appConfig.keycloak.clientId
        },
      }),
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [urlCondition]
      },
    ]
  }
}
