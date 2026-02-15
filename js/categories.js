/**
 * DeciBelle — Category Configuration
 * ====================================
 * Edit this file to add/remove/reorder categories.
 * Each category gets a card with interest, experience, importance, and boundaries.
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

const INTEREST_LEVELS = [
  { value: '', label: 'Select…' },
  { value: 'not-interested', label: 'Not interested' },
  { value: 'curious', label: 'Curious' },
  { value: 'interested', label: 'Interested' },
  { value: 'very-interested', label: 'Very interested' },
  { value: 'essential', label: 'Essential / must-have' },
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
  { value: 'optional', label: 'Optional' },
  { value: 'nice-to-have', label: 'Nice to have' },
  { value: 'important', label: 'Important' },
  { value: 'priority', label: 'High priority' },
];

// ── Render categories ──────────────────
function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" data-category="${cat.id}">
      <div class="category-header">
        <span class="cat-icon">${cat.icon}</span>
        ${cat.name}
      </div>
      <div class="cat-fields">
        <div>
          <label for="interest-${cat.id}">Interest</label>
          ${makeSelect(`interest_${cat.id}`, `interest-${cat.id}`, INTEREST_LEVELS)}
        </div>
        <div>
          <label for="experience-${cat.id}">Experience</label>
          ${makeSelect(`experience_${cat.id}`, `experience-${cat.id}`, EXPERIENCE_LEVELS)}
        </div>
        <div>
          <label for="importance-${cat.id}">Importance</label>
          ${makeSelect(`importance_${cat.id}`, `importance-${cat.id}`, IMPORTANCE_LEVELS)}
        </div>
      </div>
      <div class="cat-boundary">
        <label for="boundary-${cat.id}">Boundaries / Notes</label>
        <textarea id="boundary-${cat.id}" name="boundary_${cat.id}" rows="2" placeholder="Specific limits, preferences, or requests for this category…"></textarea>
      </div>
    </div>
  `).join('');
}

function makeSelect(name, id, options) {
  const opts = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  return `<select name="${name}" id="${id}">${opts}</select>`;
}

document.addEventListener('DOMContentLoaded', renderCategories);
