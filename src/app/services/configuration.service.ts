import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type AppConfig = {
  api: {
    host: string;
  },
  keycloak: {
    host: string;
    realm: string;
    clientId: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private readonly _http = inject(HttpClient);

  public getConfig(): Observable<AppConfig | undefined> {
    return this._http.get<AppConfig | undefined>("/app.config.json");
  }
}
