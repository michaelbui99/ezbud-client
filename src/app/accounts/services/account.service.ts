import { Injectable } from '@angular/core';
import { Account } from '../model/account';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  getAccounts(): Observable<Account[]> {
    return of([
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
            cleared: true,
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
    ]);
  }
}
