#!/bin/bash
# Cole no terminal (fora do Cursor) ou execute: bash SUBIR_NO_GITHUB.sh
# Uso: cd /Users/fabrica/projects/ridepromo-dashboard && bash SUBIR_NO_GITHUB.sh

set -e
cd "$(dirname "$0")"

echo ">>> git init"
git init

echo ">>> git add ."
git add .

echo ">>> git commit"
git diff --staged --quiet && echo "(nada novo)" || git commit -m "chore: initial RidePromo dashboard"

echo ">>> git remote (remove se existir)"
git remote remove origin 2>/dev/null || true

echo ">>> git remote add origin"
git remote add origin https://github.com/GabrielCordeiroBarrosoTeles/ridepromo-dashboard.git

echo ">>> git branch -M main"
git branch -M main

echo ">>> git push -u origin main"
git push -u origin main

echo ""
echo "✅ Tudo no ar. Repo: https://github.com/GabrielCordeiroBarrosoTeles/ridepromo-dashboard"
