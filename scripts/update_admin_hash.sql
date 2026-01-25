-- Atualizar usuário com hash correto
-- Execute no Supabase SQL Editor

UPDATE admin_users 
SET password_hash = '$2a$10$0lK7UTlx0jW7AJ4TyLNFtO7GTPlYF/mk09kwPUQKp/nfVjnVFOeeO',
    updated_at = NOW()
WHERE email = 'cliente@teste.com';

-- Verificar atualização
SELECT email, password_hash FROM admin_users WHERE email = 'cliente@teste.com';