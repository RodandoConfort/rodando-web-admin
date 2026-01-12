export interface TableColumn<T = unknown> {
  /** Id de la columna, sirve para matColumnDef y displayedColumns */
  id: string;

  /** Texto del header */
  header: string;

  /** Nombre de la propiedad en T para mostrar (modo simple) */
  field?: keyof T & string;

  /** Alineación opcional para estilos */
  align?: 'left' | 'center' | 'right';

  /** Si está deshabilitada o se oculta */
  hidden?: boolean;
}


/** Acción que aparece en el menú de "Acciones" */
export interface TableAction {
  id: string;          // 'create', 'edit', 'delete', etc.
  label: string;
  icon?: string;       // nombre de mat-icon (ej: 'add', 'edit', 'delete')
  disabled?: boolean;
}
