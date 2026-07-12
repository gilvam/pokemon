import { TestBed } from '@angular/core/testing';
import { StatBar } from './stat-bar';

describe('StatBar', () => {
  it('expõe role=progressbar com os atributos aria corretos', () => {
    const fixture = TestBed.createComponent(StatBar);
    fixture.componentRef.setInput('label', 'Ataque');
    fixture.componentRef.setInput('value', 55);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('progressbar');
    expect(host.getAttribute('aria-valuenow')).toBe('55');
    expect(host.getAttribute('aria-valuemax')).toBe('255');
    expect(host.getAttribute('aria-label')).toBe('Ataque: 55');
  });

  it('calcula o percentual preenchido com base no max', () => {
    const fixture = TestBed.createComponent(StatBar);
    fixture.componentRef.setInput('label', 'Velocidade');
    fixture.componentRef.setInput('value', 100);
    fixture.componentRef.setInput('max', 200);
    fixture.detectChanges();

    const fill = fixture.nativeElement.querySelector('.stat-bar__fill') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });
});
