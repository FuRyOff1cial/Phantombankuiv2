# 🚀 Setup Guide - Phantom Bank NUI

Guia passo-a-passo para configurar o Phantom Bank no seu servidor FiveM.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Servidor FiveM rodando
- ✅ Framework instalado (ESX, QBCore, ou custom)
- ✅ Sistema de database (oxmysql, mysql-async, etc.)
- ✅ Node.js 18+ e pnpm instalados (para build)
- ✅ Conhecimento básico de Lua e FiveM

## 📦 Passo 1: Build da NUI

### 1.1 Clone o Repositório

```bash
git clone https://github.com/seu-usuario/phantom_bank_nui.git
cd phantom_bank_nui
```

### 1.2 Instale as Dependências

```bash
pnpm install
```

### 1.3 Build para Produção

```bash
pnpm build
```

Os arquivos compilados estarão na pasta `/dist`.

## 🗂️ Passo 2: Estrutura do Recurso

### 2.1 Crie a Estrutura de Pastas

No seu servidor FiveM, crie a seguinte estrutura:

```
resources/
└── phantom_bank/
    ├── html/
    │   ├── index.html
    │   └── assets/
    │       ├── index-[hash].js
    │       └── index-[hash].css
    ├── client/
    │   └── client.lua
    ├── server/
    │   ├── server.lua
    │   └── database.lua
    ├── shared/
    │   └── config.lua
    ├── locales/
    │   ├── en.lua
    │   └── pt.lua
    └── fxmanifest.lua
```

### 2.2 Copie os Arquivos da NUI

Copie todo o conteúdo de `/dist` para `resources/phantom_bank/html/`:

```bash
# No diretório do projeto NUI
cp -r dist/* /caminho/para/seu/servidor/resources/phantom_bank/html/
```

## 🗄️ Passo 3: Setup do Database

### 3.1 Execute o SQL

Execute o arquivo `database.example.sql` no seu database:

```bash
# MySQL/MariaDB
mysql -u root -p seu_database < database.example.sql
```

Ou importe via phpMyAdmin/Adminer/HeidiSQL.

### 3.2 Ajuste as Tabelas

Ajuste os nomes das colunas conforme seu framework:

**ESX:**
- Use `identifier` (geralmente `char:xxxxx`)

**QBCore:**
- Use `citizenid` ao invés de `identifier`

**Custom:**
- Ajuste conforme sua necessidade

## ⚙️ Passo 4: Configuração

### 4.1 Configure o fxmanifest.lua

Copie o conteúdo de `fxmanifest.example.lua` para `resources/phantom_bank/fxmanifest.lua` e ajuste conforme necessário.

### 4.2 Configure o config.lua

1. Copie `config.example.lua` para `resources/phantom_bank/shared/config.lua`
2. Ajuste as configurações conforme seu servidor:

```lua
Config.Framework = 'esx'  -- ou 'qbcore'
Config.Currency = '$'
Config.StartingBalance = 5000
-- ... outras configurações
```

### 4.3 Locales (Opcional)

Crie arquivos de tradução em `resources/phantom_bank/locales/`:

**en.lua:**
```lua
Locales['en'] = {
    ['insufficient_funds'] = 'Insufficient funds',
    ['invalid_amount'] = 'Invalid amount',
    ['player_not_found'] = 'Player not found',
    -- ... mais traduções
}
```

## 💻 Passo 5: Implementação Lua

### 5.1 Client-side

Use o exemplo do `INTEGRATION_GUIDE.md` como base para seu `client/client.lua`.

**Principais pontos:**
- RegisterNUICallback para cada ação
- SendNUIMessage para enviar dados
- SetNuiFocus para controlar cursor

### 5.2 Server-side

Implemente os callbacks do servidor em `server/server.lua`:

```lua
-- Exemplo básico
lib.callback.register('phantom_bank:getData', function(source)
  local player = GetPlayer(source)
  return BuildBankData(player)
end)

lib.callback.register('phantom_bank:deposit', function(source, amount)
  local player = GetPlayer(source)
  -- Lógica de depósito
  return { success = true, message = 'success' }
end)
```

### 5.3 Database Queries

Crie funções para queries em `server/database.lua`:

```lua
function GetTransactions(identifier, limit)
  return MySQL.query.await([[
    SELECT * FROM bank_transactions 
    WHERE sender = ? OR receiver = ?
    ORDER BY created_at DESC 
    LIMIT ?
  ]], {identifier, identifier, limit})
end
```

## 🔧 Passo 6: Integração com Framework

### ESX

```lua
-- client.lua
ESX = exports['es_extended']:getSharedObject()

-- server.lua
ESX = exports['es_extended']:getSharedObject()

function GetPlayer(source)
  return ESX.GetPlayerFromId(source)
end
```

### QBCore

```lua
-- client.lua
QBCore = exports['qb-core']:GetCoreObject()

-- server.lua
QBCore = exports['qb-core']:GetCoreObject()

function GetPlayer(source)
  return QBCore.Functions.GetPlayer(source)
end
```

## 🧪 Passo 7: Testes

### 7.1 Teste Local (Dev Mode)

Para testar a UI sem FiveM:

1. No `App.tsx`, descomente o bloco de mock data (linhas 27-146)
2. Altere `visible` para `true` (linha 21)
3. Execute `pnpm dev`
4. Acesse `http://localhost:5173`

**⚠️ IMPORTANTE:** Remova os dados mock antes do build final!

### 7.2 Teste In-Game

1. Inicie o servidor FiveM
2. Connect ao servidor
3. Execute o comando para abrir o banco (configure em `client.lua`)
4. Teste cada funcionalidade:
   - ✅ Dashboard (saldos, transações)
   - ✅ Depósito e saque
   - ✅ Transferências
   - ✅ Empréstimos
   - ✅ Faturas
   - ✅ Cartões
   - ✅ Contas de sociedade
   - ✅ Contas compartilhadas
   - ✅ Contas poupança

### 7.3 Checklist de Validação

- [ ] UI abre e fecha corretamente
- [ ] Dados são carregados do servidor
- [ ] ESC fecha a UI
- [ ] Depósitos funcionam
- [ ] Saques funcionam
- [ ] Transferências funcionam
- [ ] Validações de saldo funcionam
- [ ] Toast notifications aparecem
- [ ] Loading states funcionam
- [ ] Todas as seções são acessíveis
- [ ] Sem erros no console (F8)
- [ ] Performance está boa (sem lag)

## 🐛 Troubleshooting

### UI não abre

```lua
-- Verifique se está enviando a mensagem corretamente
SendNUIMessage({
  action = "setVisible",
  visible = true
})

-- Verifique SetNuiFocus
SetNuiFocus(true, true)
```

### Dados não aparecem

```lua
-- Verifique o formato dos dados
SendNUIMessage({
  action = "setData",
  success = true,
  data = {
    -- todos os campos necessários
  }
})
```

### Callbacks não funcionam

```lua
-- Verifique o nome do callback
RegisterNUICallback("deposit", function(data, cb)
  -- ...
  cb({ success = true })  -- SEMPRE chame cb()
end)
```

### Erros no Console

Abra o console do jogo (F8) e procure por erros. Também verifique:
- Console do navegador (F12 no CEF debugger)
- Server console
- Logs do txAdmin

### Performance Issues

- Reduza a quantidade de transações carregadas
- Use indexes no database
- Cache dados quando possível
- Otimize queries

## 📊 Monitoramento

### Logs

Implemente logging para operações importantes:

```lua
-- server.lua
function LogTransaction(identifier, action, amount)
  print(string.format('[BANK] %s - %s - $%d', identifier, action, amount))
  
  -- Discord webhook (opcional)
  if Config.Logging.DiscordWebhook then
    SendToDiscord(Config.Logging.DiscordWebhook, {
      title = 'Bank Transaction',
      description = string.format('%s - %s - $%d', identifier, action, amount),
      color = Config.Logging.DiscordColor
    })
  end
end
```

### Métricas

Monitore:
- Número de transações por dia
- Média de saldo dos jogadores
- Empréstimos ativos
- Taxa de inadimplência
- Performance (ms por operação)

## 🔒 Segurança

### Validações Essenciais

```lua
-- SEMPRE valide no servidor
function ValidateTransaction(player, amount)
  -- Validar jogador existe
  if not player then return false end
  
  -- Validar amount
  if not amount or amount <= 0 then return false end
  
  -- Validar saldo
  if player.getAccount('bank').money < amount then return false end
  
  return true
end
```

### Rate Limiting

```lua
-- Prevenir spam
local cooldowns = {}

function CheckCooldown(source, action)
  local key = source .. '_' .. action
  local now = os.time()
  
  if cooldowns[key] and cooldowns[key] > now then
    return false
  end
  
  cooldowns[key] = now + Config.Security.CooldownBetweenTransactions
  return true
end
```

## 🎯 Otimizações

### Client-side

```lua
-- Não atualize a UI muito frequentemente
CreateThread(function()
  while true do
    Wait(5000)  -- Update a cada 5 segundos, não a cada frame
    if bankOpen then
      RefreshBankData()
    end
  end
end)
```

### Server-side

```lua
-- Use cache para dados que não mudam frequentemente
local societyCache = {}

function GetSocietyData(jobName)
  if societyCache[jobName] and societyCache[jobName].time > os.time() - 60 then
    return societyCache[jobName].data
  end
  
  local data = FetchSocietyDataFromDB(jobName)
  societyCache[jobName] = { data = data, time = os.time() }
  return data
end
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique a documentação
2. Confira os exemplos no `INTEGRATION_GUIDE.md`
3. Abra uma issue no GitHub com:
   - Descrição detalhada
   - Logs de erro
   - Framework utilizado
   - Versão do recurso

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] Build da NUI completo
- [ ] Database criado e populado
- [ ] Config.lua configurado
- [ ] Client.lua implementado
- [ ] Server.lua implementado
- [ ] Callbacks implementados
- [ ] Validações de segurança
- [ ] Rate limiting
- [ ] Logs configurados
- [ ] Testes realizados
- [ ] Backup do database
- [ ] Performance verificada
- [ ] Sem dados mock no código

## 🎉 Conclusão

Parabéns! Seu Phantom Bank está pronto para uso.

Lembre-se de:
- Fazer backups regulares
- Monitorar logs
- Atualizar conforme necessário
- Reportar bugs encontrados

**Boa sorte com seu servidor! 🚀**

---

**Need help?** Open an issue on GitHub or join our Discord community.
