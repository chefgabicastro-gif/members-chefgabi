# 06 - Payment and Webhook Flow

## Objetivo

Garantir que compra aprovada vire acesso liberado com seguranca e sem duplicidade.

## Fluxo padrao

1. Cliente finaliza checkout no gateway.
2. Gateway envia webhook para `POST /webhooks/{provider}`.
3. API valida assinatura.
4. API grava evento em `webhook_events`.
5. Worker processa evento de forma idempotente.
6. Worker cria/atualiza `orders` e `order_items`.
7. Worker cria/atualiza `entitlements`.
8. Evento marcado como processado.

## GG Checkout (implementado no MVP)

- Endpoint: `POST /api/v1/webhooks/gg-checkout`
- Normalizacao automatica de payload para:
  - `eventId`
  - `status` (`approved`, `pending`, `refunded`)
  - `email`
  - `productSlug`
- Resolucao de produto por `GG_PRODUCT_MAP` quando vier apenas `product.id`

## Estados de pagamento

- `pending`
- `approved`
- `refunded`
- `chargeback`
- `canceled`

Mapeamento sugerido:

- `approved` -> `entitlement active`
- `refunded`, `chargeback` -> `entitlement revoked`
- `pending` -> sem liberacao

## Regras criticas

- Nunca confiar em callback sem assinatura valida.
- Nunca processar o mesmo `event_id` duas vezes.
- Sempre registrar payload bruto para auditoria.

## SLA interno

- Liberacao apos compra aprovada: ate 60 segundos
- Reprocessamento automatico em falhas transitórias
