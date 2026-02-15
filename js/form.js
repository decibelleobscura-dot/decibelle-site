/**
 * DeciBelle — Step Navigation, Validation & Personalised Praise
 */

document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.step');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const totalSteps = 7;
  let currentStep = 0;

  const formData = {};

  // ── Praise system based on pronouns ──
  const praiseMap = {
    'he/him':     { pet: 'boy',  praise: ['Good boy.', 'Very good.', 'Obedient.', 'You\'re learning.', 'That\'s what I like to hear.'] },
    'she/her':    { pet: 'girl', praise: ['Good girl.', 'Very good.', 'Obedient.', 'You\'re learning.', 'That\'s what I like to hear.'] },
    'they/them':  { pet: 'pet',  praise: ['Good pet.', 'Very good.', 'Obedient.', 'You\'re learning.', 'That\'s what I like to hear.'] },
  };
  const defaultPraise = ['Very good.', 'Continue.', 'Obedient.', 'You\'re learning.', 'That\'s what I like to hear.'];

  function getPraise(stepNum) {
    const pronouns = (document.getElementById('pronouns')?.value || '').toLowerCase().trim();
    const match = Object.keys(praiseMap).find(k => pronouns.includes(k));
    if (match) {
      const pool = praiseMap[match].praise;
      return pool[Math.min(stepNum - 2, pool.length - 1)] || pool[pool.length - 1];
    }
    return defaultPraise[Math.min(stepNum - 2, defaultPraise.length - 1)] || defaultPraise[0];
  }

  // ── Confessional prompts per step ──
  const stepWhispers = {
    3: 'Now tell me what you want.',
    4: 'Show me what you crave.',
    5: 'And what you can\'t bear.',
    6: 'One last confession.',
  };

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

    // Show praise whisper on form steps after "About You"
    if (n >= 3 && n <= 6) {
      showWhisper(n);
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

  function showWhisper(stepNum) {
    const step = document.querySelector(`.step[data-step="${stepNum}"]`);
    // Remove old whisper
    step.querySelectorAll('.whisper').forEach(el => el.remove());

    const praise = getPraise(stepNum);
    const prompt = stepWhispers[stepNum] || '';

    const whisper = document.createElement('div');
    whisper.className = 'whisper';
    whisper.innerHTML = `<span class="whisper-praise">${praise}</span>${prompt ? `<span class="whisper-prompt">${prompt}</span>` : ''}`;

    const h2 = step.querySelector('h2');
    if (h2) {
      h2.parentNode.insertBefore(whisper, h2);
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
      const first = container.querySelector('.field-error');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return valid;
  }

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
        const nextStep = parseInt(nextBtn?.dataset.next);
        if (nextStep) goToStep(nextStep);
      }
    });
  });
});
