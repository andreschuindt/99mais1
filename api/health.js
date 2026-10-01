export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({
    ok: true,
    service: '99mais1',
    formConfigured: Boolean(process.env.FORM_WEBHOOK_URL)
  }));
}
