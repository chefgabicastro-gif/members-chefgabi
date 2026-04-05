# apps/api

API Node/Express do MVP.

## Rotas principais

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/products`
- `GET /api/v1/home/rows`
- `GET /api/v1/entitlements/me`
- `GET /api/v1/checkout/url/:productSlug`
- `POST /api/v1/webhooks/:provider`
- `POST /api/v1/admin/entitlements/grant`
- `GET /api/v1/admin/webhooks/events`

## Seguranca basica

- Webhook protegido por `x-webhook-secret`
- Admin protegido por `x-admin-key`
- Rotas privadas com bearer token

## GG Checkout

Endpoint:

- `POST /api/v1/webhooks/gg-checkout`

Campos aceitos no payload (com normalizacao):

- `eventId` ou `event_id` ou `id`
- `status` (ou via `event`)
- `email` em `customer.email` / `buyer.email`
- `productSlug` ou `product.id` (via `GG_PRODUCT_MAP`)

Configuracoes:

- `GG_WEBHOOK_SECRET`: segredo para validar assinatura
- `GG_PRODUCT_MAP`: mapa JSON de `productId -> productSlug`
- `GG_CHECKOUT_LINKS`: mapa JSON de `productSlug -> checkoutUrl`

Exemplo de teste:

```bash
curl -X POST http://localhost:4000/api/v1/webhooks/gg-checkout \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: dev_webhook_secret" \
  -d '{
    "event_id":"evt_001",
    "status":"approved",
    "customer":{"email":"teste@exemplo.com"},
    "product":{"id":"12345"}
  }'
```
