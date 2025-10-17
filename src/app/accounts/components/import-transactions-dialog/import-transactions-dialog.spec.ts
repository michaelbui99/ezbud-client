import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTransactionsDialog } from './import-transactions-dialog';

describe('ImportTransactionsDialog', () => {
  let component: ImportTransactionsDialog;
  let fixture: ComponentFixture<ImportTransactionsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTransactionsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
