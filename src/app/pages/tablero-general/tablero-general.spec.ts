import { TestBed } from '@angular/core/testing';
import { TableroGeneral } from './tablero-general';

describe('TableroGeneral', () => {
  it('muestra KPIs y distribucion con la semilla', async () => {
    await TestBed.configureTestingModule({
      imports: [TableroGeneral],
    }).compileComponents();

    const fixture = TestBed.createComponent(TableroGeneral);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const kpis = Array.from(el.querySelectorAll('.kpis ph-summary-widget')).length;
    expect(kpis).toBe(4);

    const secciones = el.querySelectorAll('.distribucion');
    expect(secciones.length).toBe(2);

    // 9 etapas del ciclo de vida y 3 estados.
    const filasEtapa = secciones[0].querySelectorAll('li');
    expect(filasEtapa.length).toBe(9);
    const filasEstado = secciones[1].querySelectorAll('li');
    expect(filasEstado.length).toBe(3);
  });
});
