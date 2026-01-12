import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export interface UiState {
  sidebarOpened: boolean;
  isHandset: boolean;
}

export const AdminLayoutStore = signalStore(
  { providedIn: 'root' },
  withState<UiState>({
    sidebarOpened: true, // en desktop abierto por defecto
    isHandset: false,
  }),
  withMethods((store) => ({
    setIsHandset(isHandset: boolean) {
      // Actualizamos el flag y ajustamos el sidebar
      patchState(store, {
        isHandset,
        sidebarOpened: isHandset ? false : true, // mobile cerrado, desktop abierto
      });
    },
    toggleSidebar() {
      patchState(store, {
        sidebarOpened: !store.sidebarOpened(),
      });
    },

    closeSidebar() {
      patchState(store, { sidebarOpened: false });
    },
  }))
)
