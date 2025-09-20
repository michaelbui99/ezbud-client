import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Budgetpage } from './budgetpage';

describe('Budgetpage', () => {
  let component: Budgetpage;
  let fixture: ComponentFixture<Budgetpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Budgetpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Budgetpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
