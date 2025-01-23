import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutHeadRightMenuComponent } from './layout-head-right-menu.component';

describe('LayoutHeadRightMenuComponent', () => {
  let component: LayoutHeadRightMenuComponent;
  let fixture: ComponentFixture<LayoutHeadRightMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutHeadRightMenuComponent]
    });
    fixture = TestBed.createComponent(LayoutHeadRightMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
