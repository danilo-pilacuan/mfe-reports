import { ChangeDetectionStrategy, Component, Type, computed, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectStore, remoteModuleLoader } from '@projecthub/shared';

/**
 * Consumo remote a remote (8.5): mfe-reports carga ProjectSummaryWidget
 * expuesto por mfe-projects ('./Widget') sin pasar por el shell.
 */
@Component({
  selector: 'app-proyecto-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Resumen de proyecto (widget federado)</h2>
    <p class="nota">
      Este widget lo expone <code>mfe-projects</code> y lo consume
      <code>mfe-reports</code> directamente por federacion.
    </p>
    <label class="selector">
      <span>Proyecto</span>
      <mat-select
        class="selector-select"
        [value]="proyectoId()"
        (selectionChange)="cargar($any($event).value)"
      >
        @for (p of proyectos(); track p.id) {
          <mat-option [value]="p.id">{{ p.nombre }}</mat-option>
        }
      </mat-select>
    </label>

    @if (error()) {
      <p class="fallo">No fue posible cargar el widget federado: {{ error() }}</p>
    } @else if (cargando()) {
      <p class="nota">Cargando widget...</p>
    } @else if (widget(); as w) {
      <ng-container *ngComponentOutlet="w; inputs: inputsWidget()"></ng-container>
    }
  `,
  styles: [
    `
      h2 {
        margin: 0 0 0.5rem;
        font-size: 1.25rem;
      }
      .nota {
        color: var(--ph-texto-suave, #5b6472);
        font-size: 0.875rem;
      }
      .selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 1rem 0;
        font-size: 0.875rem;

        span {
          color: var(--ph-texto-suave, #5b6472);
        }
      }

      .selector-select {
        width: 22rem;
        max-width: 100%;
      }
      .fallo {
        padding: 0.75rem;
        border: 1px solid var(--ph-peligro, #c62828);
        border-radius: var(--ph-radio, 8px);
        color: var(--ph-peligro, #c62828);
        background: #fdecea;
      }
    `,
  ],
  imports: [NgComponentOutlet, MatSelectModule, MatFormFieldModule, MatInputModule],
})
export class ProyectoWidget {
  private readonly store = inject(ProjectStore);
  private readonly cargarRemoto = remoteModuleLoader();

  protected readonly proyectos = this.store.proyectos;
  protected readonly proyectoId = signal(this.store.proyectos()[0]?.id ?? '');
  protected readonly widget = signal<Type<unknown> | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly inputsWidget = computed(() => ({ proyectoId: this.proyectoId() }));

  constructor() {
    this.cargarWidget();
  }

  protected cargar(valor: string): void {
    this.proyectoId.set(valor);
  }

  private cargarWidget(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.cargarRemoto('mfe-projects', './Widget')
      .then((m) => {
        const widget = (m as Record<string, unknown>)['ProjectSummaryWidget'];
        if (typeof widget !== 'function') {
          throw new Error("mfe-projects no expone 'ProjectSummaryWidget'");
        }
        this.widget.set(widget as Type<unknown>);
        this.cargando.set(false);
      })
      .catch((err: unknown) => {
        this.error.set(err instanceof Error ? err.message : String(err));
        this.cargando.set(false);
      });
  }
}
