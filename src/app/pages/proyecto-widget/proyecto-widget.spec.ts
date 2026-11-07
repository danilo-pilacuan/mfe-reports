import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatSelect } from '@angular/material/select';
import { ProyectoWidget } from './proyecto-widget';

describe('ProyectoWidget', () => {
  it('lista los proyectos de la semilla en el selector', async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoWidget],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProyectoWidget);
    await fixture.whenStable();
    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('mat-select'))
      .componentInstance as MatSelect;
    expect(select.options.length).toBeGreaterThan(0);
  });
});
