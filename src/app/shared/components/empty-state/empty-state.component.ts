import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-container">
      <div class="empty-icon">📭</div>
      <h3>Sin resultados</h3>
      <p>No se encontraron episodios con los filtros seleccionados</p>
    </div>
  `,
  styles: [`
    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 18px;
    }

    p {
      margin: 0;
      color: #999;
      font-size: 14px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {}
