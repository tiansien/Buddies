import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/core/services/store/theme/theme.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  isCollapsed$ = this.themeService.getIsCollapsed();

  constructor(private themeService: ThemeService, private router: Router) {}

  eventPage() {
    // Add your router navigation here
    this.router.navigate(['/default/events']);
  }
}
