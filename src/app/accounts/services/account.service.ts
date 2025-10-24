import { inject, Injectable } from '@angular/core';
import { Account } from '../model/account';
import { BehaviorSubject, map, mergeMap, Observable, of, tap } from 'rxjs';
import { ConfigurationService } from '../../services/configuration.service';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';

export type AccountsState = {
  accounts: Account[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly configurationService: ConfigurationService = inject(ConfigurationService);
  private readonly http: HttpClient = inject(HttpClient);
  private state: AccountsState = { accounts: [] }
  private accounts: BehaviorSubject<Account[]> = new BehaviorSubject([] as Account[]);
  $accounts = this.accounts.asObservable();

  saveAccount(account: Account): void {
    this.state.accounts = this.state.accounts.map(acc => acc.id === account.id ? account : acc);
    this.accounts.next(this.state.accounts);
  }

  getAccount(accountId: string): Observable<Account> {
    return this.configurationService.getConfig().pipe(
      mergeMap(config =>
        this.http.get<Account>(`${config?.api.host}/api/v1/accounts/${accountId}`)
      )
    );
  }

  getAccounts(): Observable<Account[]> {
    this.configurationService.getConfig().pipe(
      mergeMap(config =>
        this.http.get<Account[]>(`${config?.api.host}/api/v1/accounts`)
      )
    ).subscribe(accounts => {
      this.state.accounts = accounts;
      this.accounts.next(this.state.accounts);
    })

    return this.$accounts;
  }
}
