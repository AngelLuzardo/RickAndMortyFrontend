import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (message) {
      <div class="error-container">
        <div class="error-content">
          <div class="error-icon-wrapper">
            <mat-icon class="error-icon">error</mat-icon>
          </div>
          <div class="error-text">
            <h3>⚠️ Error en la solicitud</h3>
            <p class="error-message">{{ message }}</p>
            <p class="error-hint">Por favor, intenta de nuevo o recarga la página</p>
          </div>
          <button 
            mat-icon-button 
            class="close-btn"
            (click)="onClose.emit()"
            aria-label="Cerrar mensaje de error"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .error-container {
      padding: 16px;
      margin: 20px 0;
      background: linear-gradient(135deg, #fff3f3 0%, #ffe6e6 100%);
      border: 2px solid #dc3545;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.15);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .error-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .error-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      min-width: 40px;
      background: #dc3545;
      border-radius: 50%;
      color: white;
      font-size: 22px;
    }

    .error-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .error-text {
      flex: 1;
    }

    h3 {
      margin: 0 0 8px 0;
      color: #dc3545;
      font-size: 16px;
      font-weight: 600;
    }

    .error-message {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 14px;
      font-weight: 500;
      word-break: break-word;
    }

    .error-hint {
      margin: 0;
      color: #666;
      font-size: 13px;
      font-style: italic;
    }

    .close-btn {
      min-width: 40px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #dc3545;

      &:hover {
        background-color: rgba(220, 53, 69, 0.1);
      }
    }

    @media (max-width: 768px) {
      .error-container {
        padding: 12px;
        margin: 16px 0;
      }

      .error-icon-wrapper {
        width: 36px;
        height: 36px;
        min-width: 36px;
      }

      h3 {
        font-size: 14px;
      }

      .error-message {
        font-size: 13px;
      }

      .error-hint {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
  @Output() onClose = new EventEmitter<void>();
}
