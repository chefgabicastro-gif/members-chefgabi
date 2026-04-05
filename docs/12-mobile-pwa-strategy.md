# 12 - Mobile Strategy (PWA first)

## Objetivo

Entregar experiencia de app no celular sem depender inicialmente de App Store e Play Store.

## Como funciona

1. Usuario acessa o WebApp.
2. Recebe prompt para instalar na tela inicial.
3. Usa como aplicativo com tela cheia e icone proprio.

## Requisitos PWA

- `manifest.webmanifest`
- Service worker
- Splash icons
- Offline fallback
- HTTPS obrigatorio

## iOS e Android

- Android: instalacao PWA madura e simples
- iOS: suporte bom para uso principal, com algumas limitacoes de background/push

## Quando migrar para app nativo

Migrar para app nativo apenas se houver ganho claro em:

- Push avancado
- Recursos de dispositivo especificos
- Distribuicao por lojas como canal de crescimento

