import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProjectStore } from '@projecthub/shared';
import { IntlFormat, SummaryWidget } from '@projecthub/ui';

/**
 * PortfolioKpiWidget: widget federado que expone mfe-reports para el
 * dashboard del shell (8.6). KPIs del portafolio: proyectos activos y
 * avance promedio ponderado.
 */
@Component({
  selector: 'ph-portfolio-kpi-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SummaryWidget],
  template: `
    <div class="kpi-par">
      <ph-summary-widget
        titulo="Proyectos activos"
        [valor]="intl.numero(activos())"
        [detalle]="'de ' + intl.numero(total())"
        [tendencia]="'neutra'"
      />
      <ph-summary-widget
        titulo="Avance promedio"
        [valor]="intl.porcentaje(avancePromedio())"
        [detalle]="excedidos() === 0 ? 'Sin presupuestos excedidos' : intl.numero(excedidos()) + ' con presupuesto excedido'"
        [tendencia]="excedidos() === 0 ? 'positiva' : 'negativa'"
      />
    </div>
  `,
  styles: [
    `
      .kpi-par {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 0.75rem;
      }
    `,
  ],
})
export class PortfolioKpiWidget {
  protected readonly intl = inject(IntlFormat);
  private readonly store = inject(ProjectStore);

  private readonly resumenes = computed(() => this.store.resumenes());

  protected readonly total = computed(() => this.resumenes().length);

  protected readonly activos = computed(
    () => this.resumenes().filter((r) => r.proyecto.estado === 'Activo').length,
  );

  protected readonly avancePromedio = computed(() => {
    const rs = this.resumenes();
    if (rs.length === 0) return 0;
    return Math.round((rs.reduce((acc, r) => acc + r.avance, 0) / rs.length) * 10) / 10;
  });

  protected readonly excedidos = computed(
    () => this.resumenes().filter((r) => r.excedido).length,
  );
}
