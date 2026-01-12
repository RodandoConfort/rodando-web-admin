import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  showError(message: string) {
    // aquí conectas con tu sistema real de toasts/snackbars
    console.error('[ERROR]', message);
  }
}
