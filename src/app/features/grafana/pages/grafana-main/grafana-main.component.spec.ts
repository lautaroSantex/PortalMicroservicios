import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaMainComponent } from './grafana-main.component';

describe('GrafanaMainComponent', () => {
  let component: GrafanaMainComponent;
  let fixture: ComponentFixture<GrafanaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
