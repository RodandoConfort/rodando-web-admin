import { NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { DataTableComponent } from '../../../../../shared/ui/data-table/data-table.component';
import { TablePaginatorComponent } from '../../../../../shared/ui/table-paginator/table-paginator.component';
import { VehicleCategory } from '../../models/vehicle-category.model';
import { TableAction, TableColumn } from '../../../../../core/models/table-column.model';
import { TablePageEvent } from '../../../../../core/models/table-page-event.model';
import { VehicleCategoryApiService } from '../../services/vehicle-category-api.service';
import { VehicleCategoryStore } from '../../stores/store/vehicles.store';

@Component({
  selector: 'app-vehicle-category-list',
  standalone: true,
  imports: [NgIf, DataTableComponent, TablePaginatorComponent],
  templateUrl: './vehicle-category-list.component.html',
  styleUrl: './vehicle-category-list.component.scss'
})
export default class VehicleCategoryListComponent implements OnInit{

   private readonly store = inject(VehicleCategoryStore);

  // expose signals para el template
  readonly items = this.store.items;
  readonly total = this.store.total;
  readonly pageIndex = this.store.pageIndex;
  readonly pageSize = this.store.pageSize;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly selected = this.store.selected;

  // columnas siguen definidas en el componente
  readonly columns: TableColumn<VehicleCategory>[] = [
    { id: 'name', header: 'Nombre', field: 'name' },
    { id: 'description', header: 'Descripción', field: 'description' },
    { id: 'iconUrl', header: 'Ícono', field: 'iconUrl' },
    { id: 'isActive', header: 'Activa', field: 'isActive' },
  ];

  readonly actions: TableAction[] = [
    { id: 'create', label: 'Crear categoría', icon: 'add' },
    { id: 'edit', label: 'Editar seleccionadas', icon: 'edit' },
    { id: 'delete', label: 'Eliminar seleccionadas', icon: 'delete' },
  ];

  ngOnInit(): void {
    // carga inicial
    this.store.loadPage({ pageIndex: 0 });
  }

  onPageChange(event: TablePageEvent): void {
    this.store.loadPage({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  onRowClick(row: VehicleCategory): void {
    console.log('row clicked', row);
    // navegar a detalle, abrir modal, etc.
  }

  onSelectionChange(selection: readonly VehicleCategory[]): void {
    this.store.setSelection(selection as VehicleCategory[]);
  }

  onTableAction(action: TableAction): void {
    switch (action.id) {
      case 'create':
        // abrir modal de creación
        break;
      case 'edit':
        // this.selected() desde el store
        console.log('Editar', this.selected());
        break;
      case 'delete':
        // this.selected() y llamar a métodos del store que hagan delete en lote
        console.log('Eliminar', this.selected());
        break;
    }
  }
}
