import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoItensComponent } from './visualizacao-itens.component';

describe('VisualizacaoItensComponent', () => {
  let component: VisualizacaoItensComponent;
  let fixture: ComponentFixture<VisualizacaoItensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacaoItensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacaoItensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
