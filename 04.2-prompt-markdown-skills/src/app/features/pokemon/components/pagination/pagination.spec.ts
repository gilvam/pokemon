import { TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('desabilita "Anterior" na primeira página e "Próxima" na última', () => {
    const fixture = TestBed.createComponent(Pagination);
    fixture.componentRef.setInput('page', 0);
    fixture.componentRef.setInput('totalPages', 1);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect((buttons[0] as HTMLButtonElement).disabled).toBe(true);
    expect((buttons[1] as HTMLButtonElement).disabled).toBe(true);
  });

  it('emite pageChange com a página seguinte ao clicar em "Próxima"', () => {
    const fixture = TestBed.createComponent(Pagination);
    fixture.componentRef.setInput('page', 0);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();

    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));

    const buttons = fixture.nativeElement.querySelectorAll('button');
    (buttons[1] as HTMLButtonElement).click();

    expect(emitted).toBe(1);
  });

  it('emite pageChange com a página anterior ao clicar em "Anterior"', () => {
    const fixture = TestBed.createComponent(Pagination);
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();

    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));

    const buttons = fixture.nativeElement.querySelectorAll('button');
    (buttons[0] as HTMLButtonElement).click();

    expect(emitted).toBe(0);
  });

  it('mostra o rótulo "Página X de Y"', () => {
    const fixture = TestBed.createComponent(Pagination);
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Página 2 de 5');
  });
});
