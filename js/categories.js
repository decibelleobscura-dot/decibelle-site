/**
 * DeciBelle — Category Configuration
 * Edit CATEGORIES array to add/remove/reorder.
 */

const CATEGORIES = [
  { id: 'bondage',     name: 'Bondage & Restraint' },
  { id: 'impact',      name: 'Impact Play' },
  { id: 'humiliation', name: 'Humiliation & Degradation' },
  { id: 'worship',     name: 'Worship & Service' },
  { id: 'foot',        name: 'Foot Worship' },
  { id: 'roleplay',    name: 'Role Play & Scenarios' },
  { id: 'cbt',         name: 'CBT' },
  { id: 'chastity',    name: 'Chastity & Denial' },
  { id: 'sensory',     name: 'Sensory Play' },
  { id: 'pegging',     name: 'Strap-On / Pegging' },
  { id: 'sissy',       name: 'Feminisation / Sissification' },
  { id: 'medical',     name: 'Medical Play' },
  { id: 'petplay',     name: 'Pet Play' },
  { id: 'breath',      name: 'Breath Play' },
  { id: 'electro',     name: 'Electro Play' },
  { id: 'other',       name: 'Other (describe below)' },
];

const EXPERIENCE_LEVELS = [
  { value: '', label: 'Select' },
  { value: 'none', label: 'None' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'some', label: 'Some' },
  { value: 'experienced', label: 'Experienced' },
  { value: 'advanced', label: 'Advanced' },
];

const IMPORTANCE_LEVELS = [
  { value: '', label: 'Select' },
  { value: 'optional', label: 'Nice to have' },
  { value: 'important', label: 'Important' },
  { value: 'priority', label: 'High priority' },
  { value: 'essential', label: 'Essential' },
];

function makeSelect(name, id, options) {
  return `<select name="${name}" id="${id}">${options.map(o =>
    `<option value="${o.value}">${o.label}</option>`
  ).join('')}</select>`;
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" data-category="${cat.id}">
      <label class="category-toggle">
        <input type="checkbox" name="selected_${cat.id}" value="1" class="cat-checkbox">
        <span class="cat-check-box"></span>
        <span class="cat-name">${cat.name}</span>
      </label>
      <div class="cat-details">
        <div class="cat-fields">
          <div class="field">
            <label for="experience-${cat.id}">Experience</label>
            ${makeSelect(`experience_${cat.id}`, `experience-${cat.id}`, EXPERIENCE_LEVELS)}
          </div>
          <div class="field">
            <label for="importance-${cat.id}">Importance</label>
            ${makeSelect(`importance_${cat.id}`, `importance-${cat.id}`, IMPORTANCE_LEVELS)}
          </div>
        </div>
        <div class="field">
          <label for="boundary-${cat.id}">Boundaries or Notes</label>
          <textarea id="boundary-${cat.id}" name="boundary_${cat.id}" rows="2" placeholder="Limits, preferences, or specific requests for this category."></textarea>
        </div>
      </div>
    </div>
  `).join('');

  container.addEventListener('change', (e) => {
    if (!e.target.classList.contains('cat-checkbox')) return;
    const card = e.target.closest('.category-card');
    card.classList.toggle('expanded', e.target.checked);
  });
}

document.addEventListener('DOMContentLoaded', renderCategories);
