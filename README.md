# RidePromo Dashboard

Dashboard Next.js para viagens e descontos do app RidePromo/Price Analytic. Tabela de viagens com nome do cliente, valor do app, valor com desconto e botão WhatsApp.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Edite `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL` – URL do projeto Supabase (já no exemplo).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` – chave anon/publishable do Supabase (Dashboard > Settings > API). Use a **anon** (JWT) se `sb_publishable_*` não funcionar.

## Desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Subir no GitHub

```bash
git init
git add .
git commit -m "chore: initial RidePromo dashboard"
git remote add origin https://github.com/GabrielCordeiroBarrosoTeles/ridepromo-dashboard.git
git branch -M main
git push -u origin main
```

Ou execute: `bash scripts/push-to-github.sh`

## Deploy (Vercel)

Ver **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** para o passo a passo. Em resumo:

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → importe `GabrielCordeiroBarrosoTeles/ridepromo-dashboard`
2. Configure as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. **Deploy**

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Button, Card, Table)
- Supabase (trips, ride_options, users)
- Lucide React (ícones)

## Cores (RidePromo)

- Primary: `#fd6c13`
- Green (WhatsApp): `#2d682a`
- Background: `#f5f5f5`
