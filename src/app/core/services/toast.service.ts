import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration = 3000): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 3500): void {
    this.show(message, 'warning', duration);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}