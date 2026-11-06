import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IntlFormat } from '@projecthub/ui';
import { ProjectStore, descargarArchivo, nombreConFecha, serializarCsv } from '@projecthub/shared';

interface FilaPresupuesto {
  id: string;
  nombre: string;
  asignado: number;
  consumido: number;
  desviacion: number;
  excedido: boolean;
}

/**
 * Reporte de presupuesto asignado vs consumido (7.3), ordenado por
 * desviacion descendente. Solo lectura.
 */
@Component({
  selector: 'app-presupuesto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './presupuesto.html',
  styleUrl: './presupuesto.scss',
})
export class Presupuesto {
  private readonly store = inject(ProjectStore);
  protected readonly intl = inject(IntlFormat);

  protected readonly filas = computed<FilaPresupuesto[]>(() =>
    this.store
      .resumenes()
      .map((r) => ({
        id: r.proyecto.id,
        nombre: r.proyecto.nombre,
        asignado: r.presupuestoAsignado,
        consumido: r.presupuestoConsumido,
        desviacion: r.desviacion,
        excedido: r.excedido,
      }))
      .sort((a, b) => b.desviacion - a.desviacion),
  );

  protected readonly totalAsignado = computed(() =>
    this.filas().reduce((acc, f) => acc + f.asignado, 0),
  );

  protected readonly totalConsumido = computed(() =>
    this.filas().reduce((acc, f) => acc + f.consumido, 0),
  );

  /** Exporta el reporte a CSV (docs/funcionalidades.md 7.5). */
  protected exportarCsv(): void {
    const filas = this.filas().map((f) => ({
      Proyecto: f.nombre,
      Asignado: f.asignado,
      Consumido: f.consumido,
      Desviacion: f.desviacion,
      Excedido: f.excedido ? 'si' : 'no',
    }));
    descargarArchivo(
      serializarCsv(filas),
      nombreConFecha('presupuesto'),
      'text/csv;charset=utf-8',
    );
  }
}
