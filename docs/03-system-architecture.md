# 03 - System Architecture

## Contexto de alto nivel

Componentes:

1. WebApp/PWA (front premium)
2. API Gateway
3. Auth Service (SSO)
4. Catalog Service
5. Entitlement Service
6. Billing Integration (webhooks)
7. Notification Service
8. Admin Panel
9. Data Layer (PostgreSQL + Redis)
10. Observability (logs, traces, errors)

## Dominios principais

- Identity
- Product Catalog
- Order/Billing
- Entitlements
- Progress Tracking
- Recommendation/Upsell

## Fluxo principal de acesso

1. Usuario loga.
2. API resolve perfil + entitlements.
3. Home renderiza produtos liberados/bloqueados.
4. Ao clicar em produto bloqueado, abre detalhe com oferta.
5. Compra aprovada via webhook atualiza entitlement.
6. Produto fica liberado automaticamente.

## Escalabilidade

- API stateless
- Cache de leitura no Redis
- Fila para tarefas assincronas
- Idempotencia nos webhooks

