# 07 - Security and Compliance

## Baseline de seguranca

- Hash de senha com Argon2 ou BCrypt forte
- JWT curto + refresh token rotativo
- Rate limiting em login e webhooks
- Encrypt em repouso e em transito

## Entitlements seguros

- API nunca libera conteudo por flag do front
- Toda permissao deve vir do backend
- Checagem de acesso por rota sensivel

## Billing seguro

- Validacao de assinatura de webhook
- Idempotencia por `provider + event_id`
- Log de alteracoes de acesso

## Operacao

- Logs estruturados por request id
- Alertas para falhas de webhook
- Backups diarios do banco

## Privacidade

- Coleta minima de dados pessoais
- Politica clara de retencao
- Canal para solicitacoes LGPD

