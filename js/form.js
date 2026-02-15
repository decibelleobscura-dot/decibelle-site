/**
 * DeciBelle — Step Navigation & Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.step');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const totalSteps = 7; // 0=hero, 1=expectations, 2-6=form, 7=confirmation
  let currentStep = 0;

  // Collected form data across steps
  const formData = {};

  function goToStep(n) {
    const current = document.querySelector(`.step[data-step="${currentStep}"]`);
    const next = document.querySelector(`.step[data-step="${n}"]`);
    if (!current || !next) return;

    current.classList.remove('active', 'fade-in');
    current.style.display = 'none';

    next.style.display = 'flex';
    // Trigger reflow for animation
    void next.offsetWidth;
    next.classList.add('active', 'fade-in');

    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Progress bar
    if (n === 0) {
      progressBar.classList.remove('visible');
    } else if (n === totalSteps) {
      progressFill.style.width = '100%';
      setTimeout(() => progressBar.classList.remove('visible'), 800);
    } else {
      progressBar.classList.add('visible');
      const pct = ((n) / (totalSteps - 1)) * 100;
      progressFill.style.width = pct + '%';
    }
  }

  // Collect fields from a container into formData
  function collectFields(container) {
    container.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.type === 'checkbox') {
        formData[el.name] = el.checked;
      } else if (el.value.trim()) {
        formData[el.name] = el.value.trim();
      }
    });
  }

  // Validate required fields in a container
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

    // Age check
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

  // Click handlers for step navigation
  document.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.step-next');
    const backBtn = e.target.closest('.step-back');

    if (nextBtn && !nextBtn.matches('[type="submit"]')) {
      e.preventDefault();
      const nextStep = parseInt(nextBtn.dataset.next);
      const currentContainer = document.querySelector(`.step[data-step="${currentStep}"]`);
      collectFields(currentContainer);
      goToStep(nextStep);
    }

    if (backBtn) {
      e.preventDefault();
      const backStep = parseInt(backBtn.dataset.back);
      goToStep(backStep);
    }
  });

  // Form submissions (steps with validation)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const step = form.closest('.step');
      const stepNum = parseInt(step.dataset.step);

      if (!validateStep(form)) return;
      collectFields(form);

      // Final step?
      if (form.id === 'form-final') {
        // Also collect categories
        const catContainer = document.getElementById('categories-container');
        if (catContainer) collectFields(catContainer);

        console.log('Full enquiry:', formData);

        // ═══════════════════════════════════
        // TODO: Hook up backend here
        // e.g. fetch('https://formspree.io/f/YOUR_ID', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        // ═══════════════════════════════════

        goToStep(7);
      } else {
        const nextBtn = form.querySelector('.step-next');
        const nextStep = parseInt(nextBtn?.dataset.next);
        if (nextStep) goToStep(nextStep);
      }
    });
  });
});
