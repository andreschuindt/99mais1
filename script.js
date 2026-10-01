const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const form = document.getElementById('interestForm');
const status = document.getElementById('formStatus');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.className = 'form-status';
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Confira os campos obrigatórios antes de enviar.';
    status.classList.add('show','error');
    return;
  }

  const endpoint = window.__FORM_ENDPOINT__ || '/api/inscricao';

  try {
    const values = Object.fromEntries(new FormData(form).entries());
    values.consentimento = Boolean(values.consentimento);
    const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(values) });
    if (!response.ok) {
      const info = await response.json().catch(() => ({}));
      if (info.error === 'form_not_configured') throw new Error('FORM_NOT_CONFIGURED');
      throw new Error('Falha no envio');
    }
    status.textContent = 'Recebemos seu interesse. Obrigado por caminhar com o 99+1.';
    status.classList.add('show','success');
    form.reset();
  } catch (error) {
    status.textContent = error?.message === 'FORM_NOT_CONFIGURED'
      ? 'As inscrições serão abertas assim que o canal seguro de recebimento for ativado.'
      : 'Não foi possível enviar agora. Tente novamente em instantes.';
    status.classList.add('show','error');
  }
});
