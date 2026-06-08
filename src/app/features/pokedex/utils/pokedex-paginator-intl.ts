import { MatPaginatorIntl } from '@angular/material/paginator';

/** Builds a Portuguese (BR) labelled paginator intl for the Pokédex list. */
export function createPokedexPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Itens por página';
  intl.nextPageLabel = 'Próxima página';
  intl.previousPageLabel = 'Página anterior';
  intl.firstPageLabel = 'Primeira página';
  intl.lastPageLabel = 'Última página';
  intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (0 === length || 0 === pageSize) {
      return `0 de ${length}`;
    }
    const start = page * pageSize;
    const end = Math.min(start + pageSize, length);
    return `${start + 1} – ${end} de ${length}`;
  };
  return intl;
}
