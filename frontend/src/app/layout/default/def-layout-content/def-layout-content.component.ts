import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/core/services/store/theme/theme.service';

@Component({
  selector: 'app-def-layout-content',
  templateUrl: './def-layout-content.component.html',
  styleUrls: ['./def-layout-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefLayoutContentComponent implements OnInit {

  isCollapsed$ = this.themeService.getIsCollapsed();

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
  }

}
