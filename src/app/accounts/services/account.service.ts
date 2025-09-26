import { Injectable } from '@angular/core';
import { Account } from '../model/account';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

export type AccountsState = {
  accounts: Account[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private state: AccountsState = { accounts: [] }
  private accounts: BehaviorSubject<Account[]> = new BehaviorSubject([] as Account[]);
  $accounts = this.accounts.asObservable();

  saveAccount(account: Account): void {
    this.state.accounts = this.state.accounts.map(acc => acc.id === account.id ? account : acc);
    this.accounts.next(this.state.accounts);
  }

  getAccount(accountId: string): Observable<Account> {
    return of(
      {
        name: 'test',
        id: 'test',
        onBudget: true,
        transactions: [
          {
            payee: 'p1',
            category: '',
            cleared: true,
            deposit: 2000,
            payment: 0,
            date: new Date(2025, 1, 1),
          },
          {
            payee: 'p1',
            category: '',
            cleared: false,
            deposit: 0,
            payment: 500,
            date: new Date(2025, 1, 3),
          },
          {
            payee: 'p1',
            category: '',
            cleared: true,
            deposit: 0,
            payment: 1000,
            date: new Date(2025, 1, 2),
          },
        ]
      }
    )
  }

  getAccounts(): Observable<Account[]> {
    this.state.accounts = [
      {
        name: 'test',
        id: 'test',
        onBudget: true,
        transactions: [
          {
            payee: 'p1',
            category: '',
            cleared: true,
            deposit: 2000,
            payment: 0,
            date: new Date(2025, 1, 1),
          },
          {
            payee: 'p1',
            category: '',
            cleared: false,
            deposit: 0,
            payment: 500,
            date: new Date(2025, 1, 3),
          },
          {
            payee: 'p1',
            category: '',
            cleared: true,
            deposit: 0,
            payment: 1000,
            date: new Date(2025, 1, 2),
          },
        ]
      },
      {
        name: 'test2',
        id: 'test2',
        onBudget: true,
        transactions: [
          {
            payee: 'p1',
            category: '',
            cleared: true,
            deposit: 2000,
            payment: 0,
            date: new Date(2025, 1, 1),
          },
          {
            payee: 'p1',
            category: '',
            cleared: true,
            deposit: 0,
            payment: 700,
            date: new Date(2025, 1, 3),
          },
          {
            payee: 'p1',
            category: '',
            cleared: true,
            deposit: 0,
            payment: 1000,
            date: new Date(2025, 1, 2),
          },
        ]
      }
    ];
    this.accounts.next(this.state.accounts);
    return this.$accounts;
  }
}
