/**
 * Keyboard Navigation
 * 
 * Handles keyboard shortcuts and arrow key navigation
 */

import { collapseCurrentSection, expandCurrentSection } from './collapsible';

export function initKeyboardNavigation(searchInputId: string = 'sidebar-search'): void {
  const searchInput = document.getElementById(searchInputId) as HTMLInputElement;

  // Global "/" shortcut to focus search
  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput?.focus();
      return;
    }

    // Arrow key navigation
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    const items = Array.from(document.querySelectorAll('[data-nav-item]')) as HTMLElement[];
    const activeElement = document.activeElement as HTMLElement;
    const isNavItem = activeElement?.hasAttribute('data-nav-item');

    let currentIndex = -1;

    if (isNavItem) {
      // Focus is on a nav item, use it
      currentIndex = items.indexOf(activeElement);
    } else {
      // Focus is elsewhere (probably body), find the .active nav item
      const activeNavItem = document.querySelector('[data-nav-item].active') as HTMLElement;
      if (activeNavItem) {
        currentIndex = items.indexOf(activeNavItem);
      } else {
        // No active item, start from first item
        currentIndex = -1;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        focusItem(items, currentIndex + 1);
        break;
      case 'ArrowUp':
        focusItem(items, currentIndex - 1);
        break;
      case 'ArrowLeft':
        if (isNavItem) {
          collapseCurrentSection(activeElement);
        }
        break;
      case 'ArrowRight':
        if (isNavItem) {
          expandCurrentSection(activeElement);
        }
        break;
      case 'Home':
        focusItem(items, 0);
        break;
      case 'End':
        focusItem(items, items.length - 1);
        break;
    }
  });
}

function focusItem(items: HTMLElement[], index: number): void {
  if (index < 0) index = items.length - 1;
  if (index >= items.length) index = 0;
  items[index]?.focus();
}

