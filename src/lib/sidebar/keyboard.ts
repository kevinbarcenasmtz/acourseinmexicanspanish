/**
 * Keyboard Navigation
 * 
 * Implements roving tabindex pattern for sidebar navigation.
 * - Only one item is tabbable at a time (tabindex="0")
 * - Arrow keys move focus between items
 * - Home/End jump to first/last
 * - Left/Right collapse/expand sections
 */

import { collapseCurrentSection, expandCurrentSection } from './collapsible';

let currentFocusedItem: HTMLElement | null = null;

export function initKeyboardNavigation(searchInputId: string = 'sidebar-search'): void {
  const searchInput = document.getElementById(searchInputId) as HTMLInputElement;
  const nav = searchInput?.closest('.sidebar-content')?.querySelector('.sidebar-nav');
  
  if (!nav) return;

  // Set up roving tabindex - only active item or first item is tabbable
  const items = getVisibleNavItems(nav);
  const activeItem = nav.querySelector('.nav-item.active') as HTMLElement;
  
  items.forEach((item) => {
    item.setAttribute('tabindex', '-1');
  });
  
  if (activeItem) {
    activeItem.setAttribute('tabindex', '0');
    currentFocusedItem = activeItem;
  } else if (items[0]) {
    items[0].setAttribute('tabindex', '0');
    currentFocusedItem = items[0];
  }

  // Global "/" shortcut to focus search
  document.addEventListener('keydown', handleGlobalKeydown);
  
  // Navigation keydown handler
  nav.addEventListener('keydown', handleNavKeydown);
}

function handleGlobalKeydown(e: KeyboardEvent): void {
  // Skip if user is typing in an input
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (e.key === '/') {
    e.preventDefault();
    const searchInput = document.querySelector('[id^="sidebar-search-"]') as HTMLInputElement;
    searchInput?.focus();
  }
}

function handleNavKeydown(e: KeyboardEvent): void {
  const target = e.target as HTMLElement;
  
  // Handle section header keyboard interaction
  if (target.classList.contains('nav-section-header')) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const section = target.closest('.nav-section');
      if (section && !section.classList.contains('expanded')) {
        target.click(); // Expand
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const section = target.closest('.nav-section');
      if (section && section.classList.contains('expanded')) {
        target.click(); // Collapse
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Move to first item in section if expanded, or next section header
      const section = target.closest('.nav-section');
      if (section?.classList.contains('expanded')) {
        const firstItem = section.querySelector('.nav-item') as HTMLElement;
        if (firstItem) {
          setFocusedItem(firstItem);
          return;
        }
      }
      // Move to next section header
      const allHeaders = Array.from(document.querySelectorAll('.nav-section-header')) as HTMLElement[];
      const currentIndex = allHeaders.indexOf(target);
      if (currentIndex < allHeaders.length - 1) {
        allHeaders[currentIndex + 1].focus();
      }
    }
    return;
  }
  
  // Handle nav item keyboard interaction
  if (!target.hasAttribute('data-nav-item')) return;

  const nav = target.closest('.sidebar-nav');
  if (!nav) return;

  const items = getVisibleNavItems(nav);
  const currentIndex = items.indexOf(target);

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (currentIndex < items.length - 1) {
        setFocusedItem(items[currentIndex + 1]);
      }
      break;

    case 'ArrowUp':
      e.preventDefault();
      if (currentIndex > 0) {
        setFocusedItem(items[currentIndex - 1]);
      } else {
        // Move to section header
        const section = target.closest('.nav-section');
        const header = section?.querySelector('.nav-section-header') as HTMLElement;
        if (header) header.focus();
      }
      break;

    case 'ArrowLeft':
      e.preventDefault();
      collapseCurrentSection(target);
      // Move focus to section header
      const sectionLeft = target.closest('.nav-section');
      const headerLeft = sectionLeft?.querySelector('.nav-section-header') as HTMLElement;
      if (headerLeft) headerLeft.focus();
      break;

    case 'ArrowRight':
      e.preventDefault();
      expandCurrentSection(target);
      break;

    case 'Home':
      e.preventDefault();
      if (items[0]) {
        setFocusedItem(items[0]);
      }
      break;

    case 'End':
      e.preventDefault();
      if (items[items.length - 1]) {
        setFocusedItem(items[items.length - 1]);
      }
      break;

    case 'Enter':
    case ' ':
      // Let the default link behavior work
      break;
  }
}

function getVisibleNavItems(container: Element): HTMLElement[] {
  return Array.from(
    container.querySelectorAll('.nav-section.expanded .nav-item:not(.hidden)')
  ) as HTMLElement[];
}

function setFocusedItem(item: HTMLElement): void {
  // Remove tabindex from previous item
  if (currentFocusedItem) {
    currentFocusedItem.setAttribute('tabindex', '-1');
    currentFocusedItem.removeAttribute('data-focused');
  }

  // Set tabindex on new item and focus it
  item.setAttribute('tabindex', '0');
  item.setAttribute('data-focused', 'true');
  item.focus();
  currentFocusedItem = item;

  // Scroll into view if needed
  item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// Clean up on blur
document.addEventListener('focusout', (e) => {
  const target = e.target as HTMLElement;
  if (target.hasAttribute('data-nav-item')) {
    target.removeAttribute('data-focused');
  }
});
