import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private _toolbarHeight: BehaviorSubject<number> = new BehaviorSubject(0);
  toolbarHeight$: Observable<number> = this._toolbarHeight.asObservable();

  constructor() { }

  setToolbarHeight(heightInPixels: number) {
    this._toolbarHeight.next(heightInPixels);
  }
}
