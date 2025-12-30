/**
 * Collapsible Sections
 * 
 * Handles expand/collapse functionality for navigation sections
 */

import { getCollapsedSections, addCollapsedSection, removeCollapsedSection } from './storage';

export function initCollapsibleSections(): void {
  const sections = document.querySelectorAll('.nav-section');
  const collapsedSections = getCollapsedSections();

  sections.forEach((section) => {
    const button = section.querySelector('.nav-section-header') as HTMLButtonElement;
    const content = section.querySelector('.nav-section-content') as HTMLElement;
    const sectionId = section.getAttribute('data-section');

    if (!button || !content || !sectionId) return;

    // Restore collapsed state from localStorage
    if (collapsedSections.includes(sectionId)) {
      content.classList.remove('expanded');
      section.classList.remove('expanded');
      button.setAttribute('aria-expanded', 'false');
    } else {
      section.classList.add('expanded');
    }

    button.addEventListener('click', () => toggleSection(section, button, content, sectionId));
  });
}

function toggleSection(
  section: Element,
  button: HTMLButtonElement,
  content: HTMLElement,
  sectionId: string,
): void {
  const isExpanded = content.classList.contains('expanded');

  if (isExpanded) {
    content.classList.remove('expanded');
    section.classList.remove('expanded');
    button.setAttribute('aria-expanded', 'false');
    addCollapsedSection(sectionId);
  } else {
    content.classList.add('expanded');
    section.classList.add('expanded');
    button.setAttribute('aria-expanded', 'true');
    removeCollapsedSection(sectionId);
  }
}

export function collapseCurrentSection(element: HTMLElement): void {
  const section = element.closest('.nav-section');
  if (!section) return;

  const button = section.querySelector('.nav-section-header') as HTMLButtonElement;
  const content = section.querySelector('.nav-section-content') as HTMLElement;
  const sectionId = section.getAttribute('data-section');

  if (button && content && sectionId && content.classList.contains('expanded')) {
    toggleSection(section, button, content, sectionId);
  }
}

export function expandCurrentSection(element: HTMLElement): void {
  const section = element.closest('.nav-section');
  if (!section) return;

  const button = section.querySelector('.nav-section-header') as HTMLButtonElement;
  const content = section.querySelector('.nav-section-content') as HTMLElement;
  const sectionId = section.getAttribute('data-section');

  if (button && content && sectionId && !content.classList.contains('expanded')) {
    toggleSection(section, button, content, sectionId);
  }
}

