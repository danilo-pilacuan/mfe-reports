import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  BITACORA_SEMILLA,
  ENTREGABLES_SEMILLA,
  ETAPAS_SEMILLA,
  ProjectStore,
  PROYECTOS_SEMILLA,
} from '@projecthub/shared';
import { TableroGeneral } from './tablero-general';

describe('TableroGeneral', () => {
  it('muestra KPIs y distribucion con la semilla', async () => {
    await TestBed.configureTestingModule({
      imports: [TableroGeneral],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TableroGeneral);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const nav = el.querySelectorAll('ph-section-nav a');
    expect(nav.length).toBe(2);

    const kpis = Array.from(el.querySelectorAll('.kpis ph-summary-widget')).length;
    expect(kpis).toBe(4);

    const secciones = el.querySelectorAll('.distribucion');
    expect(secciones.length).toBe(2);

    // 9 etapas del ciclo de vida y 3 estados.
    const filasEtapa = secciones[0].querySelectorAll('li');
    expect(filasEtapa.length).toBe(9);
    const filasEstado = secciones[1].querySelectorAll('li');
    expect(filasEstado.length).toBe(3);

    // Con datos no debe verse el mensaje de vacio.
    expect(el.querySelector('.vacio')).toBeNull();
  });

  it('muestra un estado vacio explicito cuando el portafolio no tiene proyectos', async () => {
    await TestBed.configureTestingModule({
      imports: [TableroGeneral],
      providers: [provideRouter([])],
    }).compileComponents();

    const store = TestBed.inject(ProjectStore);
    store.cargarDesdeBackend({ proyectos: [], etapas: [], entregables: [], bitacora: [] });

    const fixture = TestBed.createComponent(TableroGeneral);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const vacio = el.querySelector('.vacio');
    expect(vacio).not.toBeNull();
    expect(vacio?.textContent).toContain('Sin proyectos');

    // Sin datos no se pintan las secciones de distribucion.
    expect(el.querySelectorAll('.distribucion').length).toBe(0);

    // Restaurar para no contaminar otras specs del mismo archivo.
    store.cargarDesdeBackend({
      proyectos: PROYECTOS_SEMILLA,
      etapas: ETAPAS_SEMILLA,
      entregables: ENTREGABLES_SEMILLA,
      bitacora: BITACORA_SEMILLA,
    });
  });
});
