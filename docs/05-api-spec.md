# 05 - API Spec (MVP)

## Convencoes

- Base URL: `/api/v1`
- Auth: Bearer JWT
- Formato: JSON
- Idempotencia: header `Idempotency-Key` quando aplicavel

## Auth

1. `POST /auth/register`
2. `POST /auth/login`
3. `POST /auth/refresh`
4. `POST /auth/logout`
5. `GET /auth/me`

## Catalogo

1. `GET /products`
2. `GET /products/{slug}`
3. `GET /home/rows`

Exemplo de resposta para home:

```json
{
  "rows": [
    { "id": "continue_watching", "title": "Continue de onde parou", "items": [] },
    { "id": "unlocked", "title": "Liberados para voce", "items": [] },
    { "id": "recommended", "title": "Recomendado para voce", "items": [] },
    { "id": "locked", "title": "Desbloqueie agora", "items": [] }
  ]
}
```

## Entitlements

1. `GET /entitlements/me`
2. `GET /entitlements/check?productSlug=brownie-pro`

## Progresso

1. `GET /progress/continue-watching`
2. `PUT /progress/lessons/{lessonId}`

## Checkout e ofertas

1. `GET /offers/recommended`
2. `POST /checkout/session`

## Billing webhooks

1. `POST /webhooks/{provider}`

Regras:

- Validar assinatura do provedor
- Salvar evento bruto
- Processar com idempotencia

## Admin

1. `GET /admin/users`
2. `GET /admin/users/{id}/entitlements`
3. `POST /admin/users/{id}/entitlements/grant`
4. `POST /admin/users/{id}/entitlements/revoke`

