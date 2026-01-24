# Deploy no Vercel

## 1. Subir o código no GitHub

No terminal, na pasta do projeto:

```bash
cd /Users/fabrica/projects/ridepromo-dashboard

git init
git add .
git commit -m "chore: initial RidePromo dashboard"

git remote add origin https://github.com/GabrielCordeiroBarrosoTeles/ridepromo-dashboard.git
git branch -M main
git push -u origin main
```

> Se o repositório `GabrielCordeiroBarrosoTeles/ridepromo-dashboard` ainda não existir, crie em [github.com/new](https://github.com/new) (nome: `ridepromo-dashboard`, vazio, sem README).

---

## 2. Conectar e fazer deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e entre na sua conta (ou crie uma).
2. **Add New…** → **Project**.
3. **Import** o repositório `GabrielCordeiroBarrosoTeles/ridepromo-dashboard` (conecte o GitHub à Vercel se pedir).
4. Em **Environment Variables** adicione:

   | Nome | Valor |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://qhgwqrqlbqkdtavqjeyn.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | `sb_publishable_z5HLiLR_1K-e3HMv197sUw_jlhERu7E` |

   Se a chave `sb_publishable_*` não funcionar, use em vez dela:

   | Nome | Valor |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(anon key JWT do Supabase Dashboard → Settings → API)* |

5. **Deploy**.

A Vercel vai rodar `npm install` e `npm run build` e publicar o site. O endereço ficará no formato `https://ridepromo-dashboard-*.vercel.app` (ou o domínio que você configurar).
