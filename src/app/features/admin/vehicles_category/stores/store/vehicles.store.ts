import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { VehicleCategory } from "../../models/vehicle-category.model";
import { computed, inject } from "@angular/core";
import { VehicleCategoryApiService } from "../../services/vehicle-category-api.service";
import { catchError, Observable, of, switchMap, tap } from "rxjs";

export interface VehicleCategoryState {
  items: VehicleCategory[];
  total: number;

  pageIndex: number; // 0-based
  pageSize: number;

  loading: boolean;
  error: string | null;

  selected: VehicleCategory[];
}

const initialState: VehicleCategoryState = {
  items: [],
  total: 0,
  pageIndex: 0,
  pageSize: 10,
  loading: false,
  error: null,
  selected: [],
};

export const VehicleCategoryStore = signalStore(
  { providedIn: 'root' },

  // 1) Estado
  withState(initialState),

  // 2) Computados
  withComputed((store) => ({
    hasSelection: computed(() => store.selected().length > 0),
    totalPages: computed(() =>
      store.pageSize() > 0
        ? Math.max(1, Math.ceil(store.total() / store.pageSize()))
        : 1,
    ),
  })),

  // 3) Métodos
  withMethods((store, api = inject(VehicleCategoryApiService)) => ({
    setPageIndex(pageIndex: number): void {
      patchState(store, { pageIndex });
    },

    setPageSize(pageSize: number): void {
      patchState(store, { pageSize, pageIndex: 0 });
    },

    setSelection(selection: readonly VehicleCategory[]): void {
      patchState(store, { selected: [...selection] });
    },

    clearSelection(): void {
      patchState(store, { selected: [] });
    },

    // loadPage usando rxMethod + RxJS
    loadPage: rxMethod<{ pageIndex?: number; pageSize?: number }>(
      (origin$: Observable<{ pageIndex?: number; pageSize?: number }>) =>
        origin$.pipe(
          tap(({ pageIndex, pageSize }) => {
            const patch: Partial<VehicleCategoryState> = {};
            if (pageIndex != null) patch.pageIndex = pageIndex;
            if (pageSize != null) patch.pageSize = pageSize;

            if (Object.keys(patch).length > 0) {
              patchState(store, patch);
            }

            patchState(store, { loading: true, error: null });
          }),

          switchMap(() => {
            const pageIndex = store.pageIndex();
            const pageSize = store.pageSize();

            return api
              .listPaged({
                page: pageIndex + 1, // backend 1-based
                limit: pageSize,
              })
              .pipe(
                tap(({ items, meta }) => {
                  patchState(store, {
                    items,
                    total: meta.total,
                    loading: false,
                  });
                }),
                catchError((err) => {
                  patchState(store, {
                    loading: false,
                    error:
                      err?.message ??
                      'Error al cargar categorías de vehículos',
                    items: [],
                    total: 0,
                  });
                  return of(null);
                }),
              );
          }),
        ),
    ),
  })),
);
