import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { IntlFormat, SectionNav, SummaryWidget } from '@projecthub/ui';
import {
  ETAPAS_CICLO_VIDA,
  ETIQUETA_ETAPA,
  ETIQUETA_ESTADO,
  ProjectStore,
  descargarArchivo,
  nombreConFecha,
  serializarCsv,
} from '@projecthub/shared';

/**
 * Tablero general de indicadores (7.4): KPIs del portafolio, conteo de
 * proyectos por etapa (7.1) y por estado (7.2). Solo lectura.
 */
@Component({
  selector: 'app-tablero-general',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionNav, SummaryWidget, MatButton],
  templateUrl: './tablero-general.html',
  styleUrl: './tablero-general.scss',
})
export class TableroGeneral {
  private readonly store = inject(ProjectStore);
  protected readonly intl = inject(IntlFormat);

  /** Navegacion de secciones de reportes (ruta tecnica proyecto-widget excluida). */
  protected readonly navLinks = [
    { ruta: '/reports', etiqueta: 'Tablero general' },
    { ruta: '/reports/presupuesto', etiqueta: 'Presupuesto' },
  ];

  protected readonly resumenes = computed(() => this.store.resumenes());

  protected readonly totalProyectos = computed(() => this.resumenes().length);

  protected readonly activos = computed(
    () => this.resumenes().filter((r) => r.proyecto.estado === 'Activo').length,
  );

  protected readonly avancePromedio = computed(() => {
    const rs = this.resumenes();
    if (rs.length === 0) return 0;
    return Math.round((rs.reduce((acc, r) => acc + r.avance, 0) / rs.length) * 10) / 10;
  });

  protected readonly presupuestoAsignado = computed(() =>
    this.resumenes().reduce((acc, r) => acc + r.presupuestoAsignado, 0),
  );

  protected readonly presupuestoConsumido = computed(() =>
    this.resumenes().reduce((acc, r) => acc + r.presupuestoConsumido, 0),
  );

  protected readonly excedidos = computed(
    () => this.resumenes().filter((r) => r.excedido).length,
  );

  protected readonly porEtapa = computed(() =>
    ETAPAS_CICLO_VIDA.map((etapa) => ({
      etapa: ETIQUETA_ETAPA[etapa],
      cantidad: this.resumenes().filter((r) => r.proyecto.etapa === etapa).length,
    })),
  );

  protected readonly porEstado = computed(() =>
    (Object.keys(ETIQUETA_ESTADO) as Array<keyof typeof ETIQUETA_ESTADO>).map((estado) => ({
      estado: ETIQUETA_ESTADO[estado],
      cantidad: this.resumenes().filter((r) => r.proyecto.estado === estado).length,
    })),
  );

  /** Exporta el detalle por proyecto que alimenta los KPIs (7.5). */
  protected exportarCsv(): void {
    const filas = this.resumenes().map((r) => ({
      Proyecto: r.proyecto.nombre,
      Etapa: ETIQUETA_ETAPA[r.proyecto.etapa],
      Estado: ETIQUETA_ESTADO[r.proyecto.estado],
      'Avance %': r.avance,
      'Presupuesto asignado': r.presupuestoAsignado,
      'Presupuesto consumido': r.presupuestoConsumido,
      Desviacion: r.desviacion,
      Excedido: r.excedido ? 'si' : 'no',
    }));
    descargarArchivo(
      serializarCsv(filas),
      nombreConFecha('tablero-general'),
      'text/csv;charset=utf-8',
    );
  }
}
