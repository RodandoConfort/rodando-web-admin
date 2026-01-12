import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TablePageEvent } from '../../../core/models/table-page-event.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './table-paginator.component.html',
  styleUrl: './table-paginator.component.scss'
})
export class TablePaginatorComponent {

   /** Total de elementos */
  @Input() length = 0;

  /** Índice de página (0-based) */
  @Input() pageIndex = 0;

  /** Tamaño de página actual */
  @Input() pageSize = 10;

  /** Opciones de tamaño de página */
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];

  /** Evento con el cambio de página */
  @Output() pageChange = new EventEmitter<TablePageEvent>();

  onPage(event: PageEvent): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
