/**
 * Resizable Sidebar
 * 
 * Handles drag-to-resize functionality for the sidebar
 */

import { STORAGE_KEYS } from './storage';

export function initResizable(): void {
  const container = document.getElementById('left-sidebar-container') as HTMLElement;
  const handle = container?.querySelector('.resize-handle') as HTMLElement;

  // The actual sidebar element in the grid is the parent <aside>
  const sidebar = document.getElementById('left-sidebar') as HTMLElement;

  // Get the grid container
  const gridContainer = document.querySelector('.app-body') as HTMLElement;

  if (!container || !handle || !sidebar || !gridContainer) return;

  // Clear any existing inline grid styles on mobile/tablet to let CSS media queries work
  if (window.innerWidth < 1024) {
    gridContainer.style.gridTemplateColumns = '';
  }

  // Restore width from localStorage (only on desktop)
  const storedWidth = localStorage.getItem(STORAGE_KEYS.width);
  if (storedWidth && window.innerWidth >= 1024) {
    const width = parseInt(storedWidth, 10);
    const minWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-min'),
      10,
    );
    const maxWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-max'),
      10,
    );

    if (width >= minWidth && width <= maxWidth) {
      sidebar.style.width = `${width}px`;
      updateGridColumns(gridContainer, width);
    }
  }

  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const delta = e.clientX - startX;
    const newWidth = startWidth + delta;
    const minWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-min'),
      10,
    );
    const maxWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-max'),
      10,
    );

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      sidebar.style.width = `${newWidth}px`;
      // Only update grid columns on desktop
      if (window.innerWidth >= 1024) {
        updateGridColumns(gridContainer, newWidth);
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.width, sidebar.offsetWidth.toString());
    }
  });

  // Clear inline grid styles on mobile/tablet when window is resized
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      if (window.innerWidth < 1024) {
        gridContainer.style.gridTemplateColumns = '';
      } else if (window.innerWidth >= 1024 && sidebar.style.width) {
        // Restore grid columns on desktop if sidebar has custom width
        const sidebarWidth = sidebar.offsetWidth || parseInt(sidebar.style.width, 10);
        if (sidebarWidth) {
          updateGridColumns(gridContainer, sidebarWidth);
        }
      }
    }, 100);
  });
}

function updateGridColumns(gridContainer: HTMLElement, sidebarWidth: number): void {
  // Only apply inline styles on desktop (>= 1024px)
  // On mobile/tablet, let CSS media queries handle the layout
  if (window.innerWidth < 1024) {
    gridContainer.style.gridTemplateColumns = '';
    return;
  }

  // Get the ToC width from CSS variable
  const tocWidth = getComputedStyle(document.documentElement)
    .getPropertyValue('--toc-width')
    .trim();

  // Update grid template columns: sidebar | content (1fr) | toc
  gridContainer.style.gridTemplateColumns = `${sidebarWidth}px 1fr ${tocWidth}`;
}

