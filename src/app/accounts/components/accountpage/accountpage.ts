import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account, calculateBalance, ON_BUDGET_ACCOUNT_ID } from '../../model/account';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from '../../model/transaction';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-accountpage',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatInputModule],
  templateUrl: './accountpage.html',
  styleUrl: './accountpage.scss'
})
export class Accountpage implements OnInit {
  account: WritableSignal<Account | undefined> = signal(undefined);
  balance = computed(() => {
    const transactions = this.account() ? this.account()!.transactions : [];
    return calculateBalance(transactions);
  })

  accountNameEditable: WritableSignal<boolean> = signal(false);

  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly accountService: AccountService = inject(AccountService);


  ngOnInit(): void {
    const accountId = this.activatedRoute.snapshot.paramMap.get("id");
    if (accountId) {
      this.accountService.getAccount(accountId).subscribe({
        next: account => {
          this.account.set(account);
          if (account.name !== ON_BUDGET_ACCOUNT_ID) {
            this.accountNameEditable.set(true);
          }
        }
      })
    } else {
      this.accountService.getAccounts().subscribe({
        next: accounts => {
          const transactions: Transaction[] = accounts.flatMap(account => account.transactions);
          this.account.set({
            id: 'allaccounts',
            name: 'All accounts',
            onBudget: true,
            transactions
          });
        }
      })
    }
  }
}
