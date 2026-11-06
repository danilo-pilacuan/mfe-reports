import { TestBed } from '@angular/core/testing';
import { PortfolioKpiWidget } from './portfolio-kpi.widget';

describe('PortfolioKpiWidget', () => {
  it('muestra los KPIs del portafolio con la semilla', async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioKpiWidget],
    }).compileComponents();

    const fixture = TestBed.createComponent(PortfolioKpiWidget);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const texto = el.textContent ?? '';
    expect(texto).toContain('Proyectos activos');
    expect(texto).toContain('Avance promedio');
    expect(texto).toContain('de 6');
  });
});
