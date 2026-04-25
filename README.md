# SaaS Premium Members Area

MVP funcional de area de membros premium estilo streaming com:

- Login por email
- Catalogo de produtos com bloqueado/liberado
- Checkout da GG por produto
- Entitlements automaticos por webhook da GG
- PWA instalavel para iOS/Android sem loja
- Bot de devocional diario com GPT + Evolution API

## Apps

- `apps/api`: API de auth, catalogo, entitlements, webhook e admin
- `apps/web`: WebApp/PWA premium tipo streaming
- `docs`: arquitetura, dados, APIs e roadmap

## Rodar localmente

1. Copie `.env.example` para `.env` na raiz.
2. Instale dependencias:
   - `npm.cmd install -w apps/api`
   - `npm.cmd install -w apps/web`
3. Suba a API: `npm.cmd run dev -w apps/api`
4. Em outro terminal, suba o web: `npm.cmd run dev -w apps/web`
5. Acesse:
   - Web: `http://localhost:3000`
   - API health: `http://localhost:4000/health`

## Fluxo de compra real

1. Usuario entra no produto bloqueado e clica em `Desbloquear`.
2. O frontend busca `GET /api/v1/checkout/url/:productSlug`.
3. Usuario e redirecionado para checkout da GG com email preenchido.
4. GG envia webhook `POST /api/v1/webhooks/gg-checkout`.
5. API libera acesso automaticamente e o produto passa para `Liberado`.

## GG Checkout

- Endpoint: `POST /api/v1/webhooks/gg-checkout`
- Suporta payloads com `customer.email` e `product.id`/`productSlug`
- Se receber `product.id`, o slug e resolvido por `GG_PRODUCT_MAP`
- Para seguranca em producao, configure `GG_WEBHOOK_SECRET`
- Configure os links de checkout por produto em `GG_CHECKOUT_LINKS`
- Checklist de go-live: `docs/13-go-live-gg-checklist.md`

## Bot de devocional diario

O backend agora tambem suporta um bot que:

- gera um devocional via OpenAI Responses API
- envia no WhatsApp pela Evolution API
- agenda disparos diarios as `07:00` e `19:00` no fuso configurado
- evita reenvio duplicado por slot, mesmo com reinicio da API

### Variaveis necessarias

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (padrao: `gpt-5`)
- `DEVOTIONAL_TIMEZONE` (padrao: `America/Sao_Paulo`)
- `DEVOTIONAL_SCHEDULE` (padrao: `07:00,19:00`)
- `EVOLUTION_API_BASE_URL`
- `EVOLUTION_API_KEY`
- `EVOLUTION_INSTANCE`

### Rotas do bot

- `POST /api/v1/devotional/subscribers`
- `GET /api/v1/devotional/subscribers/:phone`
- `DELETE /api/v1/devotional/subscribers/:phone`
- `GET /api/v1/admin/devotional/status`
- `POST /api/v1/admin/devotional/send-now`
- `GET /api/v1/admin/devotional/evolution/instances`
- `POST /api/v1/admin/devotional/evolution/instances`
- `POST /api/v1/admin/devotional/evolution/instances/:instanceName/select`
- `POST /api/v1/admin/devotional/evolution/instances/:instanceName/connect`
- `POST /api/v1/admin/devotional/evolution/instances/:instanceName/restart`
- `POST /api/v1/admin/devotional/evolution/instances/:instanceName/logout`

### Exemplo rapido

```bash
curl -X POST http://localhost:4000/api/v1/devotional/subscribers \
  -H "Content-Type: application/json" \
  -d '{
    "phone":"5511999999999",
    "name":"Joao",
    "notes":"Lideranca masculina"
  }'
```

Disparo manual de teste:

```bash
curl -X POST http://localhost:4000/api/v1/admin/devotional/send-now \
  -H "Content-Type: application/json" \
  -H "x-admin-key: dev_admin_key" \
  -d '{
    "slot":"07:00",
    "phone":"5511999999999"
  }'
```

Painel de operacao:

- `http://localhost:3000/devotional-admin.html`
- Nesse painel voce consegue criar novas instancias Evolution, gerar QR Code, consultar status da linha, marcar a instancia ativa do bot, cadastrar assinantes e disparar testes manuais.

## Deploy rapido

### Docker Compose

- `docker compose up --build`

### Render

- Arquivo pronto: `render.yaml`
- Blueprint sugerido:
  - Web: `da-crise-ao-chamado-web`
  - API: `da-crise-ao-chamado-api`
- `apps/web/public/config.json` ja esta apontando para `https://da-crise-ao-chamado-api.onrender.com`
- Configure secrets no servico da API:
  - `WEBHOOK_SECRET`
  - `GG_WEBHOOK_SECRET`
  - `GG_PRODUCT_MAP`
  - `GG_CHECKOUT_LINKS`
  - `ADMIN_KEY`
