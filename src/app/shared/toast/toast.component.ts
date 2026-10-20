import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="relative overflow-hidden flex items-start justify-between gap-3 rounded-lg px-4 py-3 shadow-lg text-lg text-white animate-toast-in"
          [class]="typeClasses[toast.type]"
        >
          <span>{{ toast.message }}</span>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="opacity-80 text-2xl hover:opacity-100 leading-none cursor-pointer"
          >
            &times;
          </button>
          @if (toast.duration > 0) {
            <div
              class="absolute bottom-0 left-0 h-1 bg-white/50 animate-toast-progress"
              [style.animation-duration.ms]="toast.duration"
            ></div>
          }
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);

  typeClasses: Record<string, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-amber-500',
    info: 'bg-slate-700',
  };
}