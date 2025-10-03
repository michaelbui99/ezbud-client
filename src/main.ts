import { bootstrapApplication } from '@angular/platform-browser';
import { getAppConfig } from './app/app.config';
import { App } from './app/app';
import { AppConfig } from './app/services/configuration.service';

const initApp = async () => {
  const applicationConfig: AppConfig | undefined = await (await fetch("/app.config.json")).json();
  if (!applicationConfig) {
    throw new Error("Configuration is missing");
  }
  const appConfig = getAppConfig(applicationConfig);
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
}

initApp().catch(error => console.error(`Failed to initialize application. ${error.message || error}`))

