import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToolbarDropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'ui-moscow-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">

      <!-- ─── Left Section ─── -->
      <div class="toolbar-left">
        <span class="brand">MoSCoW</span>

        <!-- All functions dropdown -->
        <button class="dropdown-btn" (click)="toggleFunctions($event)" [class.open]="functionsOpen">
          <span>{{ selectedFunction }}</span>
          <svg class="chevron" width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 3.5L5.5 7.5L9 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          @if (functionsOpen) {
            <div class="dropdown-menu" (click)="$event.stopPropagation()">
              <button class="dropdown-item" [class.active]="selectedFunction === 'All functions'"
                (click)="selectFunction('All functions')">All functions</button>
              @for (opt of functionOptions; track opt.value) {
                <button class="dropdown-item" [class.active]="selectedFunction === opt.label"
                  (click)="selectFunction(opt.label)">{{ opt.label }}</button>
              }
            </div>
          }
        </button>

        <!-- All locations dropdown -->
        <button class="dropdown-btn" (click)="toggleLocations($event)" [class.open]="locationsOpen">
          <span>{{ selectedLocation }}</span>
          <svg class="chevron" width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 3.5L5.5 7.5L9 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          @if (locationsOpen) {
            <div class="dropdown-menu" (click)="$event.stopPropagation()">
              <button class="dropdown-item" [class.active]="selectedLocation === 'All locations'"
                (click)="selectLocation('All locations')">All locations</button>
              @for (opt of locationOptions; track opt.value) {
                <button class="dropdown-item" [class.active]="selectedLocation === opt.label"
                  (click)="selectLocation(opt.label)">{{ opt.label }}</button>
              }
            </div>
          }
        </button>

        <!-- Search -->
        <button class="icon-btn" title="Search">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.4"/>
            <path d="M10 10L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- ─── Right Section ─── -->
      <div class="toolbar-right">
        <button class="action-btn" (click)="rearrangeClicked.emit()">Rearrange</button>
        <button class="action-btn" (click)="manageTeamClicked.emit()">Manage team</button>
        <button class="action-btn" (click)="manageWorkProgramClicked.emit()">Manage work program</button>
        <button class="icon-btn" title="More options">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="3.5" r="1.25" fill="currentColor"/>
            <circle cx="8" cy="8" r="1.25" fill="currentColor"/>
            <circle cx="8" cy="12.5" r="1.25" fill="currentColor"/>
          </svg>
        </button>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 16px;
      background: #ffffff;
      border-bottom: 1px solid #E5E7EB;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
      box-sizing: border-box;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .brand {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.2px;
      margin-right: 8px;
      user-select: none;
    }

    /* Dropdown trigger button */
    .dropdown-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      font-size: 13px;
      font-family: inherit;
      font-weight: 400;
      color: #374151;
      background: #ffffff;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      transition: border-color 0.15s ease, background 0.15s ease;
      outline: none;
      height: 30px;

      &:hover {
        border-color: #9CA3AF;
        background: #F9FAFB;
      }

      &.open {
        border-color: #9CA3AF;
        background: #F9FAFB;
      }

      .chevron {
        color: #6B7280;
        flex-shrink: 0;
        margin-top: 1px;
      }
    }

    /* Dropdown menu */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      min-width: 160px;
      background: #ffffff;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
      z-index: 200;
      overflow: hidden;
      padding: 4px 0;
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 7px 12px;
      font-size: 13px;
      font-family: inherit;
      text-align: left;
      color: #374151;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: background 0.1s ease;
      white-space: nowrap;

      &:hover { background: #F3F4F6; }
      &.active {
        color: #3B82F6;
        font-weight: 500;
        background: #EFF6FF;
      }
    }

    /* Icon-only button */
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      color: #6B7280;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s ease, color 0.15s ease;

      &:hover {
        background: #F3F4F6;
        color: #374151;
      }
    }

    /* Right-side action buttons */
    .action-btn {
      display: inline-flex;
      align-items: center;
      height: 30px;
      padding: 0 12px;
      font-size: 13px;
      font-family: inherit;
      font-weight: 400;
      color: #374151;
      background: #ffffff;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      transition: border-color 0.15s ease, background 0.15s ease;
      outline: none;

      &:hover {
        border-color: #9CA3AF;
        background: #F9FAFB;
      }
    }
  `]
})
export class MoscowToolbarComponent {

  @Input() functionOptions: ToolbarDropdownOption[] = [
    { label: 'Engineering', value: 'engineering' },
    { label: 'Design', value: 'design' },
    { label: 'Product', value: 'product' },
    { label: 'Marketing', value: 'marketing' },
  ];

  @Input() locationOptions: ToolbarDropdownOption[] = [
    { label: 'London', value: 'london' },
    { label: 'New York', value: 'new-york' },
    { label: 'Singapore', value: 'singapore' },
    { label: 'Remote', value: 'remote' },
  ];

  @Output() rearrangeClicked = new EventEmitter<void>();
  @Output() manageTeamClicked = new EventEmitter<void>();
  @Output() manageWorkProgramClicked = new EventEmitter<void>();
  @Output() functionChanged = new EventEmitter<string>();
  @Output() locationChanged = new EventEmitter<string>();

  selectedFunction = 'All functions';
  selectedLocation = 'All locations';
  functionsOpen = false;
  locationsOpen = false;

  @HostListener('document:click')
  closeDropdowns(): void {
    this.functionsOpen = false;
    this.locationsOpen = false;
  }

  toggleFunctions(event: MouseEvent): void {
    event.stopPropagation();
    this.functionsOpen = !this.functionsOpen;
    this.locationsOpen = false;
  }

  toggleLocations(event: MouseEvent): void {
    event.stopPropagation();
    this.locationsOpen = !this.locationsOpen;
    this.functionsOpen = false;
  }

  selectFunction(label: string): void {
    this.selectedFunction = label;
    this.functionsOpen = false;
    this.functionChanged.emit(label);
  }

  selectLocation(label: string): void {
    this.selectedLocation = label;
    this.locationsOpen = false;
    this.locationChanged.emit(label);
  }
}
