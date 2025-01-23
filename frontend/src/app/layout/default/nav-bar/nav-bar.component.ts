import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { MENU_TOKEN } from 'src/app/config/menu';
import { ThemeService } from 'src/app/core/services/store/theme/theme.service';
import { UserService } from 'src/app/core/services/store/user/user.service';
import { Menu } from 'src/app/interface/types';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent implements OnInit {
  isCollapsed$ = this.themeService.getIsCollapsed();

  isAdmin = window.localStorage.getItem('role') === 'admin';
  isUser = window.localStorage.getItem('role') === 'user';

  constructor(
    private router: Router,
    @Inject(MENU_TOKEN) public menus: Menu[],
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}
}
