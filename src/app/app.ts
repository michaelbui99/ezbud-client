import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from "./components/toolbar/toolbar";
import { CommonModule } from '@angular/common';
import { Sidenav } from "./components/sidenav/sidenav";
import { SideNavMenuItem } from './components/sidenav/menu-item';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toolbar, CommonModule, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App  implements OnInit{
  protected readonly title = signal('ezbud-client');
  private readonly keycloak = inject(Keycloak)

  menuItems: SideNavMenuItem[] = []

  constructor() {
    this.menuItems = [
      {
        label: 'Budget',
        icon: 'savings',
        route: 'budget'
      },
      {
        label: 'Payees',
        icon: 'person',
        route: 'payees'
      },
      {
        label: 'Rules',
        icon: 'rule settings',
        route: 'rules'
      },
    ]
  }
  ngOnInit(): void {
    if (!this.keycloak.authenticated){
      this.keycloak.login();
    }
  }
}
