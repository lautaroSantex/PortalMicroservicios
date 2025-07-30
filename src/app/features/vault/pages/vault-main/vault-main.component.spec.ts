import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultMainComponent } from './vault-main.component';

describe('VaultMainComponent', () => {
  let component: VaultMainComponent;
  let fixture: ComponentFixture<VaultMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
