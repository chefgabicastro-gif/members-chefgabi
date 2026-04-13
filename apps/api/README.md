# apps/api

API Node/Express do MVP.

## Rotas principais

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/products`
- `GET /api/v1/home/rows`
- `GET /api/v1/entitlements/me`
- `GET /api/v1/products/:productSlug/workspace`
- `GET /api/v1/checkout/url/:productSlug`
- `POST /api/v1/webhooks/:provider`
- `POST /api/v1/admin/entitlements/grant`
- `POST /api/v1/admin/entitlements/revoke`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/{email}/entitlements`
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
- `PRODUCT_WORKSPACES`: mapa JSON de `productSlug -> { areaDeMembros, materialExtra, networking }`

Regras de heranca de acesso (Brownie):

- Compra `brownie-basico`: libera `brownie-basico`
- Compra `brownie-pro`: libera `brownie-pro` + `brownie-basico`
- Compra `brownie-upsell`: libera `brownie-upsell` + `brownie-pro` + `brownie-basico`

Status de webhook:

- Liberam acesso: `approved`, `paid`
- Revogam acesso: `refunded`, `chargeback`, `canceled` (`cancelled` tambem aceito)

Exemplo de `PRODUCT_WORKSPACES` para Brownie:

```json
{
  "brownie-basico": {
    "areaDeMembros": "https://seu-link-basico",
    "materialExtra": "https://seu-drive-basico",
    "networking": "https://chat.whatsapp.com/seu-link-basico"
  },
  "brownie-pro": {
    "areaDeMembros": "https://seu-link-pro",
    "materialExtra": "https://seu-drive-pro",
    "networking": "https://chat.whatsapp.com/seu-link-pro"
  },
  "brownie-upsell": {
    "areaDeMembros": "https://seu-link-upsell",
    "materialExtra": "https://seu-drive-upsell",
    "networking": "https://chat.whatsapp.com/seu-link-upsell"
  }
}
```

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
