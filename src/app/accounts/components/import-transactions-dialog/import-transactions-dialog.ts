import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { SuccessParseResult } from '../../../services/csv.service';
import { Transaction } from '../../model/transaction';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { unquote } from '../../../util/string';
import { format, isValid, parse } from 'date-fns';
import { MatTableModule } from "@angular/material/table";


export type ImportTransactionsDialogData = {
  csv: SuccessParseResult,
  rawCsv: string,
}

type TransactionExtension = Transaction & {
  hasError: boolean;
  amount: number;
  errorField?: string;
}

type TransactionsTableData = {
  Date: any;
  Payee: string | undefined;
  Notes: string | undefined;
  Category: string | undefined;
  Payment: string | undefined;
  Deposit: string | undefined;
}[];

@Component({
  selector: 'app-import-transactions-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogTitle,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    CurrencyPipe
  ],
  templateUrl: './import-transactions-dialog.html',
  styleUrl: './import-transactions-dialog.scss'
})
export class ImportTransactionsDialog implements OnInit {
  readonly tableData: WritableSignal<TransactionsTableData> = signal([])
  readonly dateSource: WritableSignal<string | undefined> = signal(undefined);
  readonly payeeSource: WritableSignal<string | undefined> = signal(undefined);
  readonly notesSource: WritableSignal<string | undefined> = signal(undefined);
  readonly categorySource: WritableSignal<string | undefined> = signal(undefined);
  readonly amountSource: WritableSignal<string | undefined> = signal(undefined);

  readonly delimiter: WritableSignal<";" | "," | "|"> = signal(";")
  readonly dateFormat: WritableSignal<string> = signal("dd.MM.yyyy");

  readonly headers: WritableSignal<string[]> = signal([]);
  readonly canImport: Signal<boolean> = computed(() => this.transactions().filter(t => t.hasError).length === 0)

  readonly data = inject<ImportTransactionsDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ImportTransactionsDialog>);

  readonly columnsToDisplay = ['date', 'payee', 'notes', 'category', 'amount'];
  readonly delimiters = [";", ",", "|"];
  readonly dateFormats = ["dd.MM.yyyy"]

  transactions: Signal<TransactionExtension[]> = computed(() => {
    const rows = this.data.csv.data;
    let res = [];
    for (let row of rows) {
      const dateSource = this.dateSource();
      const payeeSource = this.payeeSource();
      const categorySource = this.categorySource();
      const amountSource = this.amountSource();
      const notesSource = this.notesSource();

      let dateData = dateSource ? unquote(row[dateSource]) : undefined;
      let payeeData = payeeSource ? unquote(row[payeeSource]) : undefined;
      let categoryData = categorySource ? unquote(row[categorySource]) : undefined;
      let amountData = amountSource ? unquote(row[amountSource]) : undefined;
      let notesData = notesSource ? row[notesSource] : undefined;

      let hasError = false;
      let errorField: string | undefined = undefined;

      if (!dateData) {
        hasError = true;
        errorField = "date";
        dateData = "";
      }
      if (!payeeData) {
        hasError = true;
        errorField = "payee";
      }
      if (!categoryData) {
        hasError = true;
        errorField = "category";
      }
      if (!amountData) {
        hasError = true;
        errorField = "category";
      }

      let payment: number = 0;
      let deposit: number = 0;
      let amount: number = 0;
      if (amountData && typeof (amountData) === "string") {
        amount = Number.parseFloat(amountData);
        if (amount > 0) {
          deposit = Math.abs(amount);
        }
        if (amount < 0) {
          payment = Math.abs(amount);
        }
      }

      const dateFormat = this.dateFormat();
      const transaction: TransactionExtension = {
        date: parse(dateData, dateFormat, new Date()),
        payee: payeeData as string,
        category: categoryData as string,
        cleared: true,
        payment: payment,
        deposit: deposit,
        notes: notesData,
        hasError: hasError,
        errorField: errorField,
        amount: amount
      }
      res.push(transaction);
    }

    console.log(res);
    return res;
  });

  ngOnInit(): void {
    this.headers.set(this.data.csv.headers);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onImport() {
    this.dialogRef.close({
      transactions: this.transactions()
    });
  }

  formatDate(date: any) {
    if (date instanceof Date && isValid(date)) {
      return format(date, this.dateFormat());
    }
    return "Invalid date"
  }
}
