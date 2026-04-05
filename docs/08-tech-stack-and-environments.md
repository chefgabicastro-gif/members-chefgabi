# 08 - Tech Stack and Environments

## Stack recomendada

- Frontend: Next.js (App Router) + TypeScript
- PWA: manifest + service worker + install prompt
- Backend: NestJS (ou ASP.NET Core) + PostgreSQL
- Cache/fila: Redis
- Auth: Clerk/Auth0/Keycloak (escolher 1)
- Observabilidade: Sentry + OpenTelemetry + logs

## Ambientes

1. `local`
2. `staging`
3. `production`

## Variaveis de ambiente (exemplo)

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `WEBHOOK_SECRET_STRIPE`
- `WEBHOOK_SECRET_HOTMART`
- `WEBHOOK_SECRET_KIWIFY`
- `SENTRY_DSN`

## Deploy recomendado

- Web: Vercel ou Cloudflare Pages
- API: Render/Railway/AWS ECS
- Banco: PostgreSQL gerenciado
- Redis: instancia gerenciada

