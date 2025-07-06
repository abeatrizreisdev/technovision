import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerCarrosselComponent } from './banner-carrossel.component';

describe('BannerCarrosselComponent', () => {
  let component: BannerCarrosselComponent;
  let fixture: ComponentFixture<BannerCarrosselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerCarrosselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerCarrosselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
