# 99+1 — Cuidado da Alma de Missionários

Site institucional do **Projeto 99+1**, iniciativa cristã de cuidado da alma para missionários de língua portuguesa em missões urbanas e transculturais, no Brasil e no exterior.

## Proposta

- Dois encontros online por mês.
- Gratuito para missionários em campo.
- Lançamento após pelo menos 30 interessados.
- Abordagem cristocêntrica, bíblica e psicoeducativa.
- Participação de outros interessados conforme critérios e disponibilidade.
- Espaço para apoiadores, patrocinadores sociais, igrejas, agências e profissionais parceiros.
- Colaboração com o DISCIPULENDO apresentada como voluntária e independente do acesso ao 99+1.

## Estrutura técnica

Site leve, mobile-first e sem framework obrigatório.

- `index.html` — home completa.
- `styles.css` — design system e responsividade.
- `script.js` — navegação, animações e envio do formulário.
- `privacidade.html` — aviso de privacidade e limites do projeto.
- `api/inscricao.js` — função serverless que valida e encaminha inscrições.
- `api/health.js` — health check e status de configuração do formulário.
- `vercel.json` — URLs limpas e headers de segurança.
- `site.webmanifest`, `robots.txt`, `sitemap.xml` — PWA/SEO básico.
- `.github/workflows/quality.yml` — validação do repositório em push/PR.

## Formulário de inscrições

O navegador envia os dados para `/api/inscricao`. A função **não armazena dados por conta própria**. Ela encaminha o JSON para um destino HTTPS configurado em:

```bash
FORM_WEBHOOK_URL=https://seu-destino-seguro.example/webhook
```

Destinos adequados incluem um CRM, automação privada, endpoint próprio ou Google Apps Script publicado com política de acesso compatível. O projeto retorna erro controlado enquanto esse destino não estiver configurado; não há falso “enviado com sucesso”.

### Campos enviados

`nome`, `email`, `whatsapp`, `pais`, `perfil`, `contexto`, `fuso`, `expectativa`, `consentimento`, `origem` e `recebidoEm`.

## Verificação

```bash
npm run check
```

## Deploy na Vercel

Nome pretendido do projeto: `99mais1`.

Depois de criar/vincular o projeto:

```bash
vercel link
vercel env add FORM_WEBHOOK_URL production
vercel --prod
```

URL desejada: `https://99mais1.vercel.app` — sujeita à disponibilidade do alias na conta.

## Segurança e ética

O formulário solicita apenas dados necessários à lista de interesse e orienta o usuário a não enviar informações clínicas sensíveis. O 99+1 é apresentado como aconselhamento terapêutico e psicoeducação em grupo e não como substituto de psicoterapia, psiquiatria, medicina ou serviços de urgência.
