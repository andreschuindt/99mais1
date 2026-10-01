import fs from 'node:fs';

const required = [
  'index.html', 'styles.css', 'script.js', 'privacidade.html',
  'vercel.json',
  'api/inscricao.js', 'api/health.js'
];

const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error('Arquivos ausentes:', missing.join(', '));
  process.exit(1);
}

const html = fs.readFileSync('index.html', 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const links = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
const broken = [...new Set(links.filter((id) => !ids.has(id)))];
if (broken.length) {
  console.error('Âncoras quebradas:', broken.join(', '));
  process.exit(1);
}

console.log(`OK — ${required.length} arquivos essenciais e ${links.length} links internos verificados.`);
