import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutohealingCustomActionLinuxComponent } from './autohealing-custom-action-linux.component';

describe('AutohealingCustomActionLinuxComponent', () => {
  let component: AutohealingCustomActionLinuxComponent;
  let fixture: ComponentFixture<AutohealingCustomActionLinuxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutohealingCustomActionLinuxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutohealingCustomActionLinuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
