import { TestBed } from '@angular/core/testing';
import { ProyectoWidget } from './proyecto-widget';

describe('ProyectoWidget', () => {
  it('lista los proyectos de la semilla en el selector', async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoWidget],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProyectoWidget);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const opciones = el.querySelectorAll('select option');
    expect(opciones.length).toBeGreaterThan(0);
  });
});
