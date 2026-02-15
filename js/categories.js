/**
 * DeciBelle — Category Configuration
 * ====================================
 * Checkbox + expand pattern: tick to select, details slide open.
 */

const CATEGORIES = [
  { id: 'bondage',       name: 'Bondage & Restraint',   icon: '⛓' },
  { id: 'impact',        name: 'Impact Play',           icon: '🖐' },
  { id: 'humiliation',   name: 'Humiliation & Degradation', icon: '♠' },
  { id: 'worship',       name: 'Worship & Service',     icon: '👑' },
  { id: 'foot',          name: 'Foot Worship',          icon: '🦶' },
  { id: 'roleplay',      name: 'Role Play & Scenarios', icon: '🎭' },
  { id: 'cbt',           name: 'CBT',                   icon: '⚡' },
  { id: 'chastity',      name: 'Chastity & Denial',     icon: '🔒' },
  { id: 'sensory',       name: 'Sensory Play',          icon: '🕯' },
  { id: 'pegging',       name: 'Strap-On / Pegging',    icon: '♦' },
  { id: 'sissy',         name: 'Feminisation / Sissification', icon: '💄' },
  { id: 'medical',       name: 'Medical Play',          icon: '💉' },
  { id: 'petplay',       name: 'Pet Play',              icon: '🐾' },
  { id: 'breath',        name: 'Breath Play',           icon: '💨' },
  { id: 'electro',       name: 'Electro Play',          icon: '⚡' },
  { id: 'other',         name: 'Other (specify below)', icon: '✦' },
];

const EXPERIENCE_LEVELS = [
  { value: '', label: 'Select…' },
  { value: 'none', label: 'None' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'some', label: 'Some experience' },
  { value: 'experienced', label: 'Experienced' },
  { value: 'advanced', label: 'Advanced' },
];

const IMPORTANCE_LEVELS = [
  { value: '', label: 'Select…' },
  { value: 'optional', label: 'Nice to have' },
  { value: 'important', label: 'Important' },
  { value: 'priority', label: 'High priority' },
  { value: 'essential', label: 'Essential' },
];

function makeSelect(name, id, options) {
  const opts = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  return `<select name="${name}" id="${id}">${opts}</select>`;
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" data-category="${cat.id}">
      <label class="category-toggle">
        <input type="checkbox" name="selected_${cat.id}" value="1" class="cat-checkbox">
        <span class="cat-check-box"></span>
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
      </label>
      <div class="cat-details">
        <div class="cat-fields">
          <div>
            <label for="experience-${cat.id}">Experience Level</label>
            ${makeSelect(`experience_${cat.id}`, `experience-${cat.id}`, EXPERIENCE_LEVELS)}
          </div>
          <div>
            <label for="importance-${cat.id}">How Important?</label>
            ${makeSelect(`importance_${cat.id}`, `importance-${cat.id}`, IMPORTANCE_LEVELS)}
          </div>
        </div>
        <div class="cat-boundary">
          <label for="boundary-${cat.id}">Boundaries & Notes</label>
          <textarea id="boundary-${cat.id}" name="boundary_${cat.id}" rows="2" placeholder="Specific limits, preferences, or requests…"></textarea>
        </div>
      </div>
    </div>
  `).join('');

  // Toggle expand on check
  container.addEventListener('change', (e) => {
    if (!e.target.classList.contains('cat-checkbox')) return;
    const card = e.target.closest('.category-card');
    if (e.target.checked) {
      card.classList.add('expanded');
    } else {
      card.classList.remove('expanded');
    }
  });
}

document.addEventListener('DOMContentLoaded', renderCategories);
