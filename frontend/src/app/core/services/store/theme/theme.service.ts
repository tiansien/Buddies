import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  setIsCollapsed(isCollapsed: boolean): void {
    this.isCollapsed$.next(isCollapsed);
  }

  getIsCollapsed() {
    return this.isCollapsed$.asObservable();
  }

}
