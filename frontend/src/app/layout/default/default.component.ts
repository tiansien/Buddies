import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/core/services/store/theme/theme.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit, OnDestroy {

  isCollapsed$ = this.themeService.getIsCollapsed();
  isCollapsed = false;
  private destory$ = new Subject<void>();

  constructor(private themeService: ThemeService) { }

  changeCollapsed(): void {
    console.log('changeCollapsed');
    this.isCollapsed = !this.isCollapsed;
    this.themeService.setIsCollapsed(this.isCollapsed);
  }

  private subTheme() {
    this.themeService.getIsCollapsed().pipe(takeUntil(this.destory$)).subscribe(res => {
      this.isCollapsed = res;
    } );
  }

  ngOnInit(): void {
    this.subTheme();
  }

  ngOnDestroy(): void {
      this.destory$.next();
      this.destory$.complete();
  }
}
