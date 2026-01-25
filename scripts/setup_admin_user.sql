-- Script para criar usuário admin no Supabase
-- Execute este código no SQL Editor do Supabase

-- 1. Criar tabela (se não existir)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Desabilitar RLS temporariamente para inserir dados
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 3. Inserir usuário admin
-- Email: cliente@teste.com
-- Senha: 123456
-- Este hash foi gerado com bcrypt.hash("123456", 10)
INSERT INTO admin_users (email, password_hash) 
VALUES ('cliente@teste.com', '$2b$10$K8gF7Z8QqjKl.rEuIrjOve7Jz9lLdMhVehVWJpbA8M9qGzjKl.rEu')
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- 4. Reabilitar RLS (opcional - pode deixar desabilitado para admin_users)
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Verificar se foi inserido
SELECT email, created_at FROM admin_users WHERE email = 'cliente@teste.com';