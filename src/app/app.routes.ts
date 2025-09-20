import { Routes } from '@angular/router';
import { Budgetpage } from './budget/components/budgetpage/budgetpage';
import { Accountpage } from './accounts/components/accountpage/accountpage';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'budget'
  },
  {
    path: 'budget',
    component: Budgetpage
  },
  {
    path: 'account/:id',
    component: Accountpage
  }
];
