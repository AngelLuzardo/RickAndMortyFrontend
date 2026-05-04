import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    <div class="spinner-overlay">
      <div class="spinner-container">
        <mat-spinner 
          [diameter]="80"
          [strokeWidth]="4"
        ></mat-spinner>
        <p class="loading-text">Cargando episodios...</p>
        <p class="loading-hint">Por favor, aguarda</p>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 245, 250, 0.95) 100%);
      border-radius: 8px;
      margin: 20px 0;
      backdrop-filter: blur(2px);
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    ::ng-deep .mat-mdc-progress-spinner {
      margin: 0 auto;
    }

    .loading-text {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      letter-spacing: 0.3px;
    }

    .loading-hint {
      margin: 0;
      color: #999;
      font-size: 13px;
      text-align: center;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .spinner-overlay {
        min-height: 250px;
        padding: 20px;
      }

      .loading-text {
        font-size: 14px;
      }

      .loading-hint {
        font-size: 12px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
