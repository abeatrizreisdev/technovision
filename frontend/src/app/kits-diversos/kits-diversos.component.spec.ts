import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitsDiversosComponent } from './kits-diversos.component';

describe('KitsDiversosComponent', () => {
  let component: KitsDiversosComponent;
  let fixture: ComponentFixture<KitsDiversosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitsDiversosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitsDiversosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
