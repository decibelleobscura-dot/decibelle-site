/**
 * DeciBelle — Form Handling
 * ==========================
 * Static site version: collects form data and sends via EmailJS / Formspree / etc.
 * For now, shows confirmation modal. Hook up your preferred backend below.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiry-form');
  const modal = document.getElementById('confirmation-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTributeLink = document.getElementById('modal-tribute-link');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    form.querySelectorAll('.error-msg').forEach(el => el.remove());

    // Validate required fields
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (field.type === 'checkbox' && !field.checked) {
        valid = false;
        field.closest('.checkbox-label')?.classList.add('field-error');
      } else if (!field.value.trim()) {
        valid = false;
        const wrapper = field.closest('.field') || field.parentElement;
        wrapper.classList.add('field-error');
      }
    });

    // Age validation
    const age = parseInt(form.querySelector('#age')?.value);
    if (age && age < 18) {
      valid = false;
      const ageField = form.querySelector('#age').closest('.field');
      ageField.classList.add('field-error');
      const msg = document.createElement('div');
      msg.className = 'error-msg';
      msg.textContent = 'You must be 18 or older.';
      ageField.appendChild(msg);
    }

    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    console.log('Enquiry submitted:', data);

    // ═══════════════════════════════════════════
    // TODO: Send data to your backend here.
    //
    // Options:
    // 1. Formspree (free): change form action to https://formspree.io/f/YOUR_ID
    // 2. EmailJS: emailjs.send(serviceId, templateId, data)
    // 3. Google Forms: POST to your form URL
    // 4. Custom API: fetch('/api/enquiry', { method: 'POST', body: JSON.stringify(data) })
    //
    // For now, data is logged to console and modal is shown.
    // ═══════════════════════════════════════════

    // Show confirmation modal
    modal.classList.add('active');

    // Reset form
    form.reset();
  });

  // Close modal
  modalClose?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  modalTributeLink?.addEventListener('click', (e) => {
    modal.classList.remove('active');
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('active');
  });
});
