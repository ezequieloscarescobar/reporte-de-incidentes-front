import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioDeEstadoComponent } from './cambio-de-estado.component';

describe('CambioDeEstadoComponent', () => {
  let component: CambioDeEstadoComponent;
  let fixture: ComponentFixture<CambioDeEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioDeEstadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioDeEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
