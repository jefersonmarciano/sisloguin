# Supabase Migration Scripts

## 1. Extensões necessárias

```sql
-- Ativar extensão UUID
create extension if not exists "uuid-ossp";
```

## 2. Tabela de perfis

```sql
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  full_name text,
  avatar_url text,
  email text unique,
  country_code text,
  level integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 3. Tabela de transações

```sql
create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  amount numeric,
  activity text,
  status text,
  date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 4. Tabela de progresso do usuário

```sql
create table if not exists user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  progress_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 5. Tabela de métodos de saque

```sql
create table if not exists withdrawal_methods (
  id uuid primary key default uuid_generate_v4(),
  name text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 6. Tabela de detalhes de saque do usuário

```sql
create table if not exists user_withdrawal_details (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  method_id uuid references withdrawal_methods(id),
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 7. Tabela de saques

```sql
create table if not exists withdrawals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  method_id uuid references withdrawal_methods(id),
  amount numeric,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 8. Tabela de notificações

```sql
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  message text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 9. Tabela de preferências do usuário

```sql
create table if not exists user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  preferences jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 10. Tabela de cooldowns de atividades

```sql
create table if not exists activity_cooldowns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  activity text,
  cooldown_until timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 11. Tabela de ganhos do usuário

```sql
create table if not exists user_earnings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  total_earned numeric default 0,
  last_earning_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

---

> Sempre que fizer alterações no banco, adicione o comando correspondente aqui para manter o histórico de migrações.
