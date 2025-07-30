import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulMainComponent } from './consul-main.component';

describe('ConsulMainComponent', () => {
  let component: ConsulMainComponent;
  let fixture: ComponentFixture<ConsulMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
