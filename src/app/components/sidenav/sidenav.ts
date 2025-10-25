import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, computed, inject, input, Input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutService } from '../../services/layout.service';
import { SideNavMenuItem } from './menu-item';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../accounts/services/account.service';
import { Account, calculateBalance } from '../../accounts/model/account';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav implements AfterViewInit, OnInit {
  accounts: WritableSignal<Account[]> = signal<Account[]>([]);
  accountBalances: WritableSignal<{ [id: string]: number }> = signal<{ [id: string]: number }>({})

  allAccountsTotal = computed(
    () => calculateBalance(this.accounts().flatMap(acc => acc.transactions))
  );

  onBudgetAccounts = computed(() => this.accounts().filter(acc => acc.onBudget))
  onBudgetTotal = computed(
    () => calculateBalance(this.onBudgetAccounts().flatMap(acc => acc.transactions))
  );

  menuItems: InputSignal<SideNavMenuItem[]> = input<SideNavMenuItem[]>([]);
  toolbarHeight: number = 0;
  sidenavHeight: string = '100vh';


  private readonly layoutService: LayoutService = inject(LayoutService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly keycloak = inject(Keycloak);

  constructor() {
    this.layoutService.toolbarHeight$.subscribe({
      next: height => {
        this.toolbarHeight = height;
      }
    })
  }

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe({
      next: accounts => {
        this.accounts.set(accounts);

        const accountBalances = accounts.reduce(
          (acc, curr) => {
            acc[curr.id] = calculateBalance(curr.transactions);
            return acc;
          }, {} as { [id: string]: number }
        );
        this.accountBalances.set(accountBalances);
      }
    })
  }

  ngAfterViewInit(): void {
    this.sidenavHeight = `calc(100vh - ${this.toolbarHeight}px)`;
    this.cdr.detectChanges();
  }

  onLogout(){
    this.keycloak.logout();
  }
}
