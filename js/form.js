/**
 * DeciBelle — Step Navigation, Validation & Pronoun-Based Praise
 */

document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const totalSteps = 7;
  let currentStep = 0;
  const formData = {};

  // ── Praise based on pronouns ──────
  const praiseLines = {
    'he/him':    ['Good boy.', 'Very good, boy.', 'You obey well.', 'That pleases me.'],
    'she/her':   ['Good girl.', 'Very good, girl.', 'You obey well.', 'That pleases me.'],
    'they/them': ['Good pet.', 'Very good, pet.', 'You obey well.', 'That pleases me.'],
  };
  const defaultLines = ['Very good.', 'You obey well.', 'That pleases me.', 'Continue.'];

  function getPraise(index) {
    const pronouns = (document.getElementById('pronouns')?.value || '').toLowerCase().trim();
    const key = Object.keys(praiseLines).find(k => pronouns.includes(k));
    const lines = key ? praiseLines[key] : defaultLines;
    return lines[Math.min(index, lines.length - 1)];
  }

  // ── Step navigation ───────────────
  function goToStep(n) {
    const current = document.querySelector(`.step[data-step="${currentStep}"]`);
    const next = document.querySelector(`.step[data-step="${n}"]`);
    if (!current || !next) return;

    current.classList.remove('active', 'fade-in');
    current.style.display = 'none';

    next.style.display = 'flex';
    void next.offsetWidth;
    next.classList.add('active', 'fade-in');

    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Inject praise whisper on steps 3-6
    if (n >= 3 && n <= 6) {
      const whisperEl = document.getElementById(`whisper-${n}`);
      if (whisperEl) {
        const praiseIndex = n - 3;
        whisperEl.innerHTML = `<span class="whisper-praise">${getPraise(praiseIndex)}</span>`;
        // Re-trigger animation
        whisperEl.style.animation = 'none';
        void whisperEl.offsetWidth;
        whisperEl.style.animation = '';
      }
    }

    // Progress bar
    if (n === 0) {
      progressBar.classList.remove('visible');
    } else if (n === totalSteps) {
      progressFill.style.width = '100%';
      setTimeout(() => progressBar.classList.remove('visible'), 800);
    } else {
      progressBar.classList.add('visible');
      progressFill.style.width = ((n) / (totalSteps - 1)) * 100 + '%';
    }
  }

  function collectFields(container) {
    container.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.type === 'checkbox') {
        formData[el.name] = el.checked;
      } else if (el.value.trim()) {
        formData[el.name] = el.value.trim();
      }
    });
  }

  function validateStep(container) {
    let valid = true;
    container.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    container.querySelectorAll('.error-msg').forEach(el => el.remove());

    container.querySelectorAll('[required]').forEach(field => {
      if (field.type === 'checkbox' && !field.checked) {
        valid = false;
        field.closest('.checkbox-label')?.classList.add('field-error');
      } else if (!field.value.trim()) {
        valid = false;
        const wrapper = field.closest('.field') || field.parentElement;
        wrapper?.classList.add('field-error');
      }
    });

    const ageField = container.querySelector('#age');
    if (ageField && ageField.value && parseInt(ageField.value) < 18) {
      valid = false;
      const wrapper = ageField.closest('.field');
      wrapper?.classList.add('field-error');
      const msg = document.createElement('div');
      msg.className = 'error-msg';
      msg.textContent = 'You must be 18 or older.';
      wrapper?.appendChild(msg);
    }

    if (!valid) {
      container.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return valid;
  }

  // ── Event listeners ───────────────
  document.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.step-next');
    const backBtn = e.target.closest('.step-back');

    if (nextBtn && !nextBtn.matches('[type="submit"]')) {
      e.preventDefault();
      const currentContainer = document.querySelector(`.step[data-step="${currentStep}"]`);
      collectFields(currentContainer);
      goToStep(parseInt(nextBtn.dataset.next));
    }

    if (backBtn) {
      e.preventDefault();
      goToStep(parseInt(backBtn.dataset.back));
    }
  });

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep(form)) return;
      collectFields(form);

      if (form.id === 'form-final') {
        const catContainer = document.getElementById('categories-container');
        if (catContainer) collectFields(catContainer);
        console.log('Full enquiry:', formData);
        goToStep(7);
      } else {
        const nextBtn = form.querySelector('.step-next');
        if (nextBtn) goToStep(parseInt(nextBtn.dataset.next));
      }
    });
  });
});
