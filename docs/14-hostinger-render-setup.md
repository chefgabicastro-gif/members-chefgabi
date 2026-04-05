# 14 - Hostinger + Render Setup (chefgabriellacastro.site)

## Objetivo

Publicar com dois subdominios:

- `members.chefgabriellacastro.site` -> Web app
- `api.chefgabriellacastro.site` -> API

## 1) Subir no Render

1. No Render, clique em `New +` -> `Blueprint`.
2. Conecte este repositorio e selecione `render.yaml`.
3. Crie os dois servicos:
   - `chefgabi-members-api`
   - `chefgabi-members-web`
4. Aguarde deploy inicial.

## 2) Configurar variaveis da API no Render

No servico `chefgabi-members-api`, adicione:

- `WEB_ORIGIN=https://members.chefgabriellacastro.site`
- `GG_WEBHOOK_SECRET=<SEGREDO_DO_WEBHOOK_GG>`
- `GG_PRODUCT_MAP=<valor de .env.production.example>`
- `GG_CHECKOUT_LINKS=<valor de .env.production.example>`
- `ADMIN_KEY=<chave forte>`

## 3) Configurar dominio custom no Render

No servico web:

- Adicionar custom domain: `members.chefgabriellacastro.site`

No servico api:

- Adicionar custom domain: `api.chefgabriellacastro.site`

O Render vai mostrar o target DNS de cada um.

## 4) Criar DNS na Hostinger

No painel DNS da Hostinger, criar dois registros `CNAME`:

1. `members` -> `<target mostrado pelo Render para o web>`
2. `api` -> `<target mostrado pelo Render para a api>`

TTL: padrao.

## 5) SSL e propagacao

1. Esperar propagacao DNS.
2. No Render, validar certificado SSL de ambos os dominios.
3. Confirmar acesso:
   - `https://members.chefgabriellacastro.site`
   - `https://api.chefgabriellacastro.site/health`

## 6) Cadastrar webhook na GG

- URL da integracao:
  - `https://api.chefgabriellacastro.site/api/v1/webhooks/gg-checkout`
- Secret:
  - usar o mesmo valor de `GG_WEBHOOK_SECRET`
- Eventos minimos:
  - `Pix Paid`
  - `Card Paid`
  - `Card Refunded`
  - `Pix Refunded`
  - `Card Failed`
  - `Pix Failed`

## 7) Teste final

1. Login no members.
2. Clicar `Desbloquear` em um plano com checkout.
3. Finalizar compra teste.
4. Validar liberacao automatica do produto.

