# 13 - Go Live Checklist (GG Checkout)

## 1) Preencher variaveis de producao

No servico da API, configure:

- `WEBHOOK_SECRET` (apenas fallback para provedores genericos)
- `GG_WEBHOOK_SECRET` (segredo oficial da GG)
- `GG_PRODUCT_MAP`
- `GG_CHECKOUT_LINKS`
- `ADMIN_KEY`
- `WEB_ORIGIN` (dominio do web app)

Exemplo:

```env
WEB_ORIGIN=https://members.seudominio.com
GG_WEBHOOK_SECRET=SEU_SEGREDO_GG
GG_PRODUCT_MAP={"12345":"brownie-pro","67890":"escala-saas","90123":"automacoes-premium"}
GG_CHECKOUT_LINKS={"brownie-pro":"https://pay.ggcheckout.com/link-1","escala-saas":"https://pay.ggcheckout.com/link-2","automacoes-premium":"https://pay.ggcheckout.com/link-3"}
ADMIN_KEY=CHAVE_FORTE_ADMIN
```

## 2) Configurar webhook na GG

- URL: `https://api.seudominio.com/api/v1/webhooks/gg-checkout`
- Metodo: `POST`
- Enviar eventos de pagamento aprovado e reembolso/cancelamento/chargeback.
- Garantir que a assinatura/segredo enviado corresponde ao `GG_WEBHOOK_SECRET`.

## 3) Publicar API e Web

1. Publicar API (Render/Railway/etc).
2. Publicar Web.
3. Atualizar `apps/web/public/config.json` com URL final da API.
4. Confirmar CORS com `WEB_ORIGIN`.

## 4) Teste de fumaca (obrigatorio)

1. Login com email de teste no web app.
2. Clicar em `Desbloquear` em produto bloqueado.
3. Confirmar abertura do checkout GG correto.
4. Simular/realizar pagamento de teste na GG.
5. Confirmar que produto vira `Liberado` na area de membros.

## 5) Auditoria de eventos

Use a rota admin:

- `GET /api/v1/admin/webhooks/events`
- Header: `x-admin-key: <ADMIN_KEY>`

Esperado:

- evento salvo com `provider=gg-checkout`
- `eventId` unico (sem duplicidade)

## 6) Fallback operacional

Se algum cliente nao liberar automaticamente, usar rota admin:

- `POST /api/v1/admin/entitlements/grant`
- Header: `x-admin-key: <ADMIN_KEY>`
- Body:

```json
{
  "email": "cliente@dominio.com",
  "productSlug": "brownie-pro"
}
```

## 7) Checklist final de lancamento

- DNS e SSL funcionando
- Web e API online
- Webhook GG respondendo 200
- Fluxo compra -> liberacao validado
- Time de suporte com acesso ao endpoint de grant manual

