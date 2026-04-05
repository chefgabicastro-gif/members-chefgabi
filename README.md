# SaaS Premium Members Area

MVP funcional de area de membros premium estilo streaming com:

- Login por email
- Catalogo de produtos com bloqueado/liberado
- Checkout da GG por produto
- Entitlements automaticos por webhook da GG
- PWA instalavel para iOS/Android sem loja

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

## Deploy rapido

### Docker Compose

- `docker compose up --build`

### Render

- Arquivo pronto: `render.yaml`
- Ajuste `apps/web/public/config.json` com a URL da API publicada.
- Configure secrets no servico da API:
  - `WEBHOOK_SECRET`
  - `GG_WEBHOOK_SECRET`
  - `GG_PRODUCT_MAP`
  - `GG_CHECKOUT_LINKS`
  - `ADMIN_KEY`
