const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  const payload = req.body && typeof req.body === 'object' ? req.body : {};

  // Campo invisível: bots costumam preenchê-lo; pessoas não.
  if (clean(payload.website, 200)) {
    return json(res, 200, { ok: true });
  }

  const data = {
    nome: clean(payload.nome, 120),
    email: clean(payload.email, 180).toLowerCase(),
    whatsapp: clean(payload.whatsapp, 60),
    pais: clean(payload.pais, 120),
    perfil: clean(payload.perfil, 120),
    contexto: clean(payload.contexto, 80),
    fuso: clean(payload.fuso, 120),
    expectativa: clean(payload.expectativa, 900),
    consentimento: payload.consentimento === true || payload.consentimento === 'on' || payload.consentimento === 'true',
    origem: '99mais1.vercel.app',
    recebidoEm: new Date().toISOString()
  };

  if (!data.nome || !EMAIL_RE.test(data.email) || !data.pais || !data.perfil || !data.consentimento) {
    return json(res, 400, { ok: false, error: 'invalid_payload' });
  }

  const webhook = process.env.FORM_WEBHOOK_URL;
  if (!webhook) {
    // Nunca fingir sucesso se o destino de dados não está configurado.
    return json(res, 503, { ok: false, error: 'form_not_configured' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '99mais1-site/1.0'
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error('99+1 form webhook failed', { status: response.status });
      return json(res, 502, { ok: false, error: 'destination_unavailable' });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('99+1 form delivery error', { name: error?.name || 'Error' });
    return json(res, 502, { ok: false, error: 'delivery_failed' });
  }
}
