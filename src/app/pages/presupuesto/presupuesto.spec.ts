import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Presupuesto } from './presupuesto';

describe('Presupuesto', () => {
  it('lista proyectos con montos formateados y totales', async () => {
    await TestBed.configureTestingModule({
      imports: [Presupuesto],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Presupuesto);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const nav = el.querySelectorAll('ph-section-nav a');
    expect(nav.length).toBe(2);

    const cuerpo = el.querySelectorAll('tbody tr');
    expect(cuerpo.length).toBeGreaterThan(0);

    const texto = el.textContent ?? '';
    expect(texto).toContain('$');
    expect(texto).toContain('Total');

    const pie = el.querySelectorAll('tfoot td');
    expect(pie.length).toBe(4);
  });
});
