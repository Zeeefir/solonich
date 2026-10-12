export function getActiveSection(sections, marker) {
  return sections.reduce((active, section) => section.top <= marker ? section.id : active, 'catalog');
}
