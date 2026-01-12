import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { TableAction, TableColumn } from '../../../core/models/table-column.model';
import { TablePageEvent } from '../../../core/models/table-page-event.model';
import { MatPaginator, PageEvent } from "@angular/material/paginator";


@Component({
  selector: 'app-data-table',
  standalone: true,
   imports: [
    NgFor,
    NgIf,
    NgClass,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginator
],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent<T = unknown> {

   /** Título que se muestra en la card */
  @Input() title = '';

  /** Datos a mostrar */
  @Input() data: readonly T[] = [];

  /** Definición de columnas */
  @Input() columns: TableColumn<T>[] = [];

  /** Activa/desactiva columna de selección */
  @Input() enableSelection = false;

  /** Acciones del menú "Acciones" */
  @Input() actions: TableAction[] | null = null;

  /** Emite cuando se hace click en una fila */
  @Output() rowClick = new EventEmitter<T>();

  /** Emite la selección completa cada vez que cambia */
  @Output() selectionChange = new EventEmitter<readonly T[]>();

  /** Click en una acción del menú */
  @Output() actionClick = new EventEmitter<TableAction>();

   /** --- Paginación integrada --- */
  @Input() enablePagination = false;
  @Input() length = 0;         // total items
  @Input() pageIndex = 0;      // 0-based
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];

  @Output() pageChange = new EventEmitter<TablePageEvent>();

  readonly selection = new SelectionModel<T>(true, []);

  get visibleColumns(): TableColumn<T>[] {
    return this.columns.filter((c) => !c.hidden);
  }

  get selectionHasValue(): boolean {
    return this.selection.hasValue();
  }

  get isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numRows > 0 && numSelected === numRows;
  }

  get displayedColumnIds(): string[] {
    const ids = this.visibleColumns.map((c) => c.id);
    return this.enableSelection ? ['select', ...ids] : ids;
  }

  toggleAllRows(): void {
    if (this.isAllSelected) {
      this.selection.clear();
    } else {
      this.selection.select(...this.data);
    }
    this.selectionChange.emit(this.selection.selected);
  }

  toggleRow(row: T): void {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  checkboxLabel(row?: T): string {
    if (!row) {
      return this.isAllSelected ? 'deselect all' : 'select all';
    }
    const index = this.data.indexOf(row);
    return this.selection.isSelected(row)
      ? `deselect row ${index + 1}`
      : `select row ${index + 1}`;
  }

  onRowClicked(row: T): void {
    if (this.enableSelection) {
      this.toggleRow(row);
    }
    this.rowClick.emit(row);
  }

  onActionClick(action: TableAction): void {
    this.actionClick.emit(action);
  }

  onPage(event: PageEvent): void {
      this.pageChange.emit({
        pageIndex: event.pageIndex,
        pageSize: event.pageSize,
      });
    }
}
