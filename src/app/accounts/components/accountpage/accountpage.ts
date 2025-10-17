import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account, calculateBalance, ON_BUDGET_ACCOUNT_ID } from '../../model/account';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from '../../model/transaction';
import { MatInputModule } from '@angular/material/input';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MatTableModule } from '@angular/material/table';
import { format } from 'date-fns';
import { readFile } from '../../../util/FileUtil';
import { CsvService } from '../../../services/csv.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ImportTransactionsDialog, ImportTransactionsDialogData } from '../import-transactions-dialog/import-transactions-dialog';

@Component({
  selector: 'app-accountpage',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    InputTextModule,
    FloatLabel,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    MatTableModule
  ],
  templateUrl: './accountpage.html',
  styleUrl: './accountpage.scss'
})
export class Accountpage implements OnInit {
  @ViewChild('transactionsInput')
  csvFileInput!: ElementRef;

  account: WritableSignal<Account | undefined> = signal(undefined);
  balance = computed(() => {
    const transactions = this.account() ? this.account()!.transactions : [];
    return calculateBalance(transactions);
  })

  isAccountNameEditable: WritableSignal<boolean> = signal(false);
  isEditingAccountName: WritableSignal<boolean> = signal(false);
  newAccountName: WritableSignal<string> = signal(this.account() ? this.account()!.name : "");

  columnsToDisplay = ['date', 'payee', 'category', 'payment', 'deposit', 'cleared']

  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly csvService: CsvService = inject(CsvService);
  private readonly dialog = inject(MatDialog)

  ngOnInit(): void {
    const accountId = this.activatedRoute.snapshot.paramMap.get("id");
    if (accountId) {
      this.accountService.getAccount(accountId).subscribe({
        next: account => {
          this.account.set(account);
          if (account.name !== ON_BUDGET_ACCOUNT_ID) {
            this.isAccountNameEditable.set(true);
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
          this.isAccountNameEditable.set(false)
        }
      })
    }
  }

  formatDate(date: Date) {
    return format(date, "yyyy/MM/dd")
  }

  onCleared(transaction: Transaction) {
    transaction.cleared = !transaction.cleared;
  }

  onEditAccountName() {
    if (!this.isAccountNameEditable() || !this.account()) {
      return;
    }
    this.isEditingAccountName.set(true);
    this.newAccountName.set(this.account()!.name);
  }

  onSaveAccountName() {
    if (!this.isAccountNameEditable() || !this.account()) {
      return;
    }
    this.account()!.name = this.newAccountName();
    this.accountService.saveAccount(this.account()!);
    this.isEditingAccountName.set(false);
  }

  async onCsvUploaded(event: any) {
    const files = event.target["files"] as FileList;
    if (files.length === 0) {
      return;
    }

    const file = files.item(0);
    if (file === null) {
      return;
    }

    const csvContent = await readFile(file);
    const parsedCsv = await this.csvService.parseCsv(csvContent, ";");

    if (!parsedCsv.success) {
      return;
    }

    const dialogData: ImportTransactionsDialogData = {
      csv: parsedCsv,
      rawCsv: csvContent
    }

    const dialogRef = this.dialog.open(ImportTransactionsDialog, {
      data: dialogData,
      minWidth: '70vw'
    });
    dialogRef.afterClosed().subscribe({
      next: res => {
        this.csvFileInput.nativeElement.value = "";
        if (res) {
          console.log(res);
          return;
        }
      }
    })
  }
}
