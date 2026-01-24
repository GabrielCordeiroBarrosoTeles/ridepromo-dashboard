#!/bin/bash
# Sobe o ridepromo-dashboard para GitHub (rode na pasta do projeto)
set -e
cd "$(dirname "$0")/.."

git init
git add .
git commit -m "chore: initial RidePromo dashboard" 2>/dev/null || true

git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/GabrielCordeiroBarrosoTeles/ridepromo-dashboard.git
git branch -M main
git push -u origin main

echo "✅ Repositório enviado para origin main."
