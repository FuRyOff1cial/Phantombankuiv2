# 🔌 Guia de Integração - Phantom Bank NUI

Este guia mostra como integrar a NUI do Phantom Bank com seu recurso FiveM.

## 📋 Índice

1. [Estrutura de Dados](#estrutura-de-dados)
2. [Callbacks do Cliente](#callbacks-do-cliente)
3. [Exemplo de Client.lua](#exemplo-de-clientlua)
4. [Exemplo de Server.lua](#exemplo-de-serverlua)
5. [Boas Práticas](#boas-práticas)

## 📊 Estrutura de Dados

### BankOpenData - Dados Principais

```lua
local bankData = {
  -- Identificação do jogador
  identifier = "ABC12345",           -- string: ID único do jogador
  playerName = "John Doe",           -- string: Nome do jogador
  iban = "US123456789012",          -- string: IBAN/número da conta
  
  -- Saldos
  balance = 15000,                   -- number: Saldo em banco
  cash = 2500,                       -- number: Dinheiro em mãos
  
  -- Score de crédito
  creditScore = 750,                 -- number: 0-850
  creditScoreLabel = "Good",         -- string: "Poor" | "Fair" | "Good" | "Very Good" | "Excellent"
  
  -- Estado
  isAtm = false,                     -- boolean: Se está em um ATM (limita algumas funções)
  
  -- Arrays de dados
  transactions = {},                 -- Transaction[]
  loans = {},                        -- Loan[]
  invoices = {},                     -- Invoice[]
  cards = {},                        -- Card[]
  sharedAccounts = {},              -- SharedAccount[]
  businesses = {},                   -- Business[] (não implementado na UI)
  
  -- Objetos opcionais
  society = nil,                     -- Society | nil
  savings = nil,                     -- SavingsAccount | nil
  
  -- Configuração
  config = {
    currency = "$",                  -- string: Símbolo da moeda
    maxTransfer = 50000,            -- number: Valor máximo de transferência
    transferTaxPercent = 1,         -- number: Taxa de transferência (%)
    
    -- Features habilitadas
    enableLoans = true,
    enableInvoices = true,
    enableCards = true,
    enableBusiness = false,
    enableSocietyAccounts = true,
    enableSharedAccounts = true,
    enableSavingsAccounts = true
  }
}
```

### Transaction - Transação

```lua
{
  id = 1,                           -- number: ID único
  sender = "ABC12345",              -- string: ID do remetente (ou "SYSTEM", "ATM")
  receiver = "XYZ98765",            -- string: ID do destinatário
  amount = 1000,                    -- number: Valor da transação
  type = "deposit",                 -- string: "deposit" | "withdraw" | "transfer"
  description = "Paycheck",         -- string: Descrição
  created_at = "2024-01-15T10:30:00Z"  -- string: ISO 8601
}
```

### Loan - Empréstimo

```lua
{
  id = 1,                           -- number: ID único
  amount = 5000,                    -- number: Valor original
  interest = 5.5,                   -- number: Taxa de juros (%)
  total_to_pay = 5275,              -- number: Total com juros
  remaining_balance = 3200,         -- number: Valor restante
  due_date = 1704931200,            -- number: Unix timestamp
  status = "active",                -- string: "pending" | "active" | "completed" | "cancelled"
  created_at = "2024-01-01T00:00:00Z",  -- string: ISO 8601
  days_remaining = 60,              -- number: Dias até vencimento
  next_payment = 275                -- number: Valor da próxima parcela
}
```

### Invoice - Fatura

```lua
{
  id = 1,                           -- number: ID único
  sender = "DEF54321",              -- string: ID de quem enviou
  receiver = "ABC12345",            -- string: ID de quem recebe
  amount = 150,                     -- number: Valor da fatura
  reason = "Services rendered",     -- string: Motivo
  status = "pending",               -- string: "pending" | "paid" | "cancelled"
  created_at = "2024-01-14T10:00:00Z",  -- string: ISO 8601
  expires_at = 1705276800           -- number: Unix timestamp
}
```

### Card - Cartão

```lua
{
  id = 1,                           -- number: ID único
  identifier = "ABC12345",          -- string: Proprietário
  card_number_masked = "**** **** **** 1234",  -- string: Número mascarado
  card_number_last4 = "1234",       -- string: Últimos 4 dígitos
  card_type = "debit",              -- string: "debit" | "gold" | "express"
  status = "active",                -- string: "active" | "blocked"
  wrong_pin_count = 0,              -- number: Tentativas erradas de PIN
  expires_at = 1735689600,          -- number: Unix timestamp
  created_at = "2023-11-01T00:00:00Z"  -- string: ISO 8601
}
```

### Society - Sociedade/Job

```lua
{
  jobName = "police",               -- string: Nome do job
  jobLabel = "Los Santos Police Department",  -- string: Label do job
  balance = 50000                   -- number: Saldo da sociedade
}
```

### SharedAccount - Conta Compartilhada

```lua
{
  id = 1,                           -- number: ID único
  name = "Family Account",          -- string: Nome da conta
  balance = 8000,                   -- number: Saldo
  role = "owner"                    -- string: "owner" | "member"
}
```

### SavingsAccount - Conta Poupança

```lua
{
  balance = 12000,                  -- number: Saldo atual
  last_interest_at = 1701388800,    -- number: Unix timestamp do último rendimento
  total_interest_earned = 250,      -- number: Total de juros ganhos
  accrued_since_last = 25,          -- number: Juros acumulados desde último pagamento
  interest_rate = 2.5,              -- number: Taxa de juros (%)
  frequency = "monthly",            -- string: Frequência ("daily" | "weekly" | "monthly")
  period_seconds = 2592000,         -- number: Segundos entre rendimentos
  next_interest_at = 1733961600     -- number: Unix timestamp do próximo rendimento
}
```

## 🔄 Callbacks do Cliente

### Exemplo Completo de Callbacks

```lua
-- client.lua

local bankOpen = false
local bankData = nil

-- Função para buscar dados do banco
function GetBankData()
  local data = lib.callback.await('phantom_bank:getData', false)
  return data
end

-- Abrir banco
RegisterNetEvent('phantom_bank:open', function()
  if bankOpen then return end
  
  bankOpen = true
  bankData = GetBankData()
  
  SetNuiFocus(true, true)
  
  -- Abrir UI
  SendNUIMessage({
    action = "setVisible",
    visible = true
  })
  
  -- Enviar dados
  SendNUIMessage({
    action = "setData",
    success = true,
    data = bankData
  })
end)

-- Fechar banco
function CloseBank()
  if not bankOpen then return end
  
  bankOpen = false
  bankData = nil
  
  SetNuiFocus(false, false)
  
  SendNUIMessage({
    action = "setVisible",
    visible = false
  })
end

-- Atualizar dados após operação
function RefreshBankData()
  if not bankOpen then return end
  
  bankData = GetBankData()
  
  SendNUIMessage({
    action = "setData",
    success = true,
    data = bankData
  })
end

-- CALLBACKS DA NUI

RegisterNUICallback("close", function(data, cb)
  CloseBank()
  cb({ success = true })
end)

RegisterNUICallback("logout", function(data, cb)
  CloseBank()
  cb({ success = true })
end)

-- TRANSAÇÕES

RegisterNUICallback("deposit", function(data, cb)
  local result = lib.callback.await('phantom_bank:deposit', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("withdraw", function(data, cb)
  local result = lib.callback.await('phantom_bank:withdraw', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("transfer", function(data, cb)
  local result = lib.callback.await('phantom_bank:transfer', false, data.targetIdentifier, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

-- EMPRÉSTIMOS

RegisterNUICallback("requestLoan", function(data, cb)
  local result = lib.callback.await('phantom_bank:requestLoan', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("payLoan", function(data, cb)
  local result = lib.callback.await('phantom_bank:payLoan', false, data.loanId, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("cancelLoan", function(data, cb)
  local result = lib.callback.await('phantom_bank:cancelLoan', false, data.loanId)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

-- FATURAS

RegisterNUICallback("payInvoice", function(data, cb)
  local result = lib.callback.await('phantom_bank:payInvoice', false, data.invoiceId)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("declineInvoice", function(data, cb)
  local result = lib.callback.await('phantom_bank:declineInvoice', false, data.invoiceId)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

-- CARTÕES

RegisterNUICallback("createCard", function(data, cb)
  local result = lib.callback.await('phantom_bank:createCard', false, data.pin, data.cardType)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("changeCardPin", function(data, cb)
  local result = lib.callback.await('phantom_bank:changeCardPin', false, data.cardId, data.oldPin, data.newPin)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("setCardStatus", function(data, cb)
  local result = lib.callback.await('phantom_bank:setCardStatus', false, data.cardId, data.status)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

-- SOCIEDADE

RegisterNUICallback("depositSociety", function(data, cb)
  local result = lib.callback.await('phantom_bank:depositSociety', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("withdrawSociety", function(data, cb)
  local result = lib.callback.await('phantom_bank:withdrawSociety', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("transferToSociety", function(data, cb)
  local result = lib.callback.await('phantom_bank:transferToSociety', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("transferFromSociety", function(data, cb)
  local result = lib.callback.await('phantom_bank:transferFromSociety', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

-- CONTAS COMPARTILHADAS

RegisterNUICallback("createSharedAccount", function(data, cb)
  local result = lib.callback.await('phantom_bank:createSharedAccount', false, data.accountName)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("depositShared", function(data, cb)
  local result = lib.callback.await('phantom_bank:depositShared', false, data.accountId, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("withdrawShared", function(data, cb)
  local result = lib.callback.await('phantom_bank:withdrawShared', false, data.accountId, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("addSharedMember", function(data, cb)
  local result = lib.callback.await('phantom_bank:addSharedMember', false, data.accountId, data.targetIdentifier)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("removeSharedMember", function(data, cb)
  local result = lib.callback.await('phantom_bank:removeSharedMember', false, data.accountId, data.targetIdentifier)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

-- POUPANÇA

RegisterNUICallback("depositSavings", function(data, cb)
  local result = lib.callback.await('phantom_bank:depositSavings', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

RegisterNUICallback("withdrawSavings", function(data, cb)
  local result = lib.callback.await('phantom_bank:withdrawSavings', false, data.amount)
  
  if result.success then
    RefreshBankData()
  end
  
  cb(result)
end)

-- ESC para fechar
RegisterCommand('+bankClose', function()
  if bankOpen then
    CloseBank()
  end
end, false)

RegisterKeyMapping('+bankClose', 'Close Bank UI', 'keyboard', 'ESCAPE')
```

## 📤 Exemplo de Server.lua

```lua
-- server.lua

-- Exemplo de callback para obter dados do banco
lib.callback.register('phantom_bank:getData', function(source)
  local player = GetPlayer(source)
  if not player then return nil end
  
  local data = {
    identifier = player.identifier,
    playerName = player.name,
    iban = player.iban,
    balance = player.getAccount('bank').money,
    cash = player.getAccount('money').money,
    creditScore = GetCreditScore(player.identifier),
    creditScoreLabel = GetCreditScoreLabel(GetCreditScore(player.identifier)),
    isAtm = false,
    
    transactions = GetTransactions(player.identifier, 50),
    loans = GetLoans(player.identifier),
    invoices = GetInvoices(player.identifier),
    cards = GetCards(player.identifier),
    sharedAccounts = GetSharedAccounts(player.identifier),
    businesses = {},
    
    society = GetSocietyData(player.job.name),
    savings = GetSavingsAccount(player.identifier),
    
    config = {
      currency = "$",
      maxTransfer = 50000,
      transferTaxPercent = 1,
      enableLoans = true,
      enableInvoices = true,
      enableCards = true,
      enableBusiness = false,
      enableSocietyAccounts = true,
      enableSharedAccounts = true,
      enableSavingsAccounts = true
    }
  }
  
  return data
end)

-- Exemplo de callback de depósito
lib.callback.register('phantom_bank:deposit', function(source, amount)
  local player = GetPlayer(source)
  if not player then 
    return { success = false, message = "player_not_found" }
  end
  
  amount = tonumber(amount)
  if not amount or amount <= 0 then
    return { success = false, message = "invalid_amount" }
  end
  
  local cash = player.getAccount('money').money
  if cash < amount then
    return { success = false, message = "insufficient_funds" }
  end
  
  -- Realizar depósito
  player.removeAccountMoney('money', amount)
  player.addAccountMoney('bank', amount)
  
  -- Registrar transação
  AddTransaction(player.identifier, "SYSTEM", player.identifier, amount, "deposit", "Cash deposit")
  
  return { success = true, message = "success" }
end)

-- Função auxiliar para calcular label do credit score
function GetCreditScoreLabel(score)
  if score >= 800 then return "Excellent"
  elseif score >= 740 then return "Very Good"
  elseif score >= 670 then return "Good"
  elseif score >= 580 then return "Fair"
  else return "Poor"
  end
end
```

## ✅ Boas Práticas

### 1. Sempre Validar Dados no Servidor

```lua
-- ❌ N��o confie nos dados do cliente
lib.callback.register('phantom_bank:transfer', function(source, targetIdentifier, amount)
  -- SEMPRE validar:
  -- - Se o jogador existe
  -- - Se tem saldo suficiente
  -- - Se o valor é válido (> 0)
  -- - Se o destinatário existe
  -- - Se não está tentando transferir para si mesmo
end)
```

### 2. Atualizar UI Após Operações

```lua
-- ✅ Sempre refresh após sucesso
if result.success then
  RefreshBankData()  -- Atualiza a UI com novos dados
end
```

### 3. Mensagens de Erro Consistentes

Use as chaves de tradução suportadas:
- `insufficient_funds`
- `invalid_amount`
- `player_not_found`
- `invalid_player`
- `transfer_failed`
- `loan_denied`
- `invoice_not_found`
- `card_limit_reached`
- `insufficient_permissions`
- `account_not_found`
- `error`

### 4. Logs e Segurança

```lua
-- ✅ Sempre logar operações importantes
function AddTransaction(identifier, sender, receiver, amount, type, description)
  -- Salvar no banco de dados
  MySQL.insert('INSERT INTO transactions (...) VALUES (...)', {...})
  
  -- Log para admins
  print(string.format('[BANK] %s | %s -> %s | $%d | %s', 
    type, sender, receiver, amount, description))
end
```

### 5. Performance

```lua
-- ✅ Cache dados quando possível
local cachedSocietyData = {}

function GetSocietyData(jobName)
  if cachedSocietyData[jobName] and 
     cachedSocietyData[jobName].timestamp > os.time() - 60 then
    return cachedSocietyData[jobName].data
  end
  
  -- Buscar dados
  local data = FetchSocietyData(jobName)
  cachedSocietyData[jobName] = {
    data = data,
    timestamp = os.time()
  }
  
  return data
end
```

## 🎯 Checklist de Implementação

- [ ] Todos os callbacks do cliente implementados
- [ ] Validações de servidor implementadas
- [ ] Sistema de transações funcionando
- [ ] Logs de operações implementados
- [ ] Tradução de erros configurada
- [ ] Permissões de sociedade configuradas
- [ ] Sistema de cartões integrado (se aplicável)
- [ ] Testes realizados em ambiente de desenvolvimento
- [ ] Backup do banco de dados realizado antes do deploy

## 📞 Suporte

Se tiver dúvidas sobre a integração, abra uma issue no GitHub com:
1. Descrição do problema
2. Código relevante
3. Logs de erro (se houver)
4. Framework que está usando (ESX, QBCore, etc)

---

**Boa sorte com sua implementação! 🚀**
