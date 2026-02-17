# 🏦 Phantom Bank - FiveM NUI

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FiveM](https://img.shields.io/badge/FiveM-Ready-success.svg)](https://fivem.net/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

Uma interface NUI moderna e completa para sistemas bancários do FiveM, construída com React, TypeScript e TailwindCSS.

![Phantom Bank Preview](preview.png)

## ✨ Características

### 🎨 Design Moderno
- Interface escura estilo GTA RP
- Gradientes roxo/azul e efeitos visuais sofisticados
- Animações suaves usando Motion (Framer Motion)
- Componentes glassmorphism compatíveis com CEF
- Sistema de notificações toast elegante
- Totalmente responsivo

### 💼 Funcionalidades Bancárias

#### 📊 Dashboard
- Visualização de saldo (banco e dinheiro)
- Score de crédito com indicadores visuais
- Histórico de transações com filtros
- Operações rápidas (depósito/saque)

#### 💸 Transferências
- Transferência entre jogadores via identificador
- Cálculo automático de taxas
- Validação de limites e saldo
- Confirmação visual de transações

#### 💳 Cartões
- Criação de cartões (débito/gold/express)
- Gerenciamento de PIN (4 dígitos)
- Bloqueio/desbloqueio de cartões
- Visualização de detalhes com animações holográficas

#### 📝 Faturas (Invoices)
- Recebimento de faturas
- Pagamento e recusa de faturas
- Sistema de expiração
- Histórico organizado

#### 💰 Empréstimos (Loans)
- Solicitação de empréstimos baseada em score
- Pagamento parcial ou total
- Cancelamento de empréstimos pendentes
- Visualização de juros e datas de vencimento

#### 🏢 Contas de Sociedade (Society)
- Acesso via cargo (job)
- Depósito e saque
- Transferências entre banco pessoal e sociedade
- Visualização de saldo da organização

#### 👥 Contas Compartilhadas (Shared Accounts)
- Criação de contas conjuntas
- Sistema de permissões (owner/member)
- Adição/remoção de membros
- Gestão de depósitos e saques

#### 🐷 Contas Poupança (Savings)
- Sistema de juros automáticos
- Depósito e saque
- Visualização de rendimentos acumulados
- Próxima data de rendimento

## 🚀 Instalação

### Requisitos
- Node.js 18+ e pnpm
- Recurso FiveM `phantom_bank` (não incluído - apenas NUI)

### Build para Produção

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/phantom_bank_nui.git
cd phantom_bank_nui

# Instale as dependências
pnpm install

# Build para produção
pnpm build
```

Os arquivos compilados estarão em `/dist` prontos para serem copiados para a pasta `html` do seu recurso FiveM.

### Estrutura do Recurso FiveM

```
phantom_bank/
├── html/
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
├── client/
│   └── client.lua
├── server/
│   └── server.lua
└── fxmanifest.lua
```

## 🔌 Integração com FiveM

### Protocolo de Comunicação

#### 1. Do Servidor para UI (window.postMessage)

**Abrir/Fechar UI:**
```javascript
// Abrir UI
SendNUIMessage({
  action: "setVisible",
  visible: true
})

// Fechar UI
SendNUIMessage({
  action: "setVisible",
  visible: false
})
```

**Enviar Dados Bancários:**
```javascript
SendNUIMessage({
  action: "setData",
  success: true,
  data: {
    identifier: "ABC12345",
    playerName: "John Doe",
    iban: "US123456789012",
    balance: 15000,
    cash: 2500,
    creditScore: 750,
    creditScoreLabel: "Good",
    isAtm: false,
    transactions: [...],
    loans: [...],
    invoices: [...],
    cards: [...],
    society: {...},
    sharedAccounts: [...],
    savings: {...},
    businesses: [],
    config: {
      currency: "$",
      maxTransfer: 50000,
      transferTaxPercent: 1,
      enableLoans: true,
      enableInvoices: true,
      enableCards: true,
      enableBusiness: false,
      enableSocietyAccounts: true,
      enableSharedAccounts: true,
      enableSavingsAccounts: true
    }
  }
})
```

#### 2. Da UI para Servidor (fetch)

Todas as ações do usuário enviam requisições POST para `https://phantom_bank/<callback>`:

```lua
-- client.lua exemplo
RegisterNUICallback("deposit", function(data, cb)
  -- data.amount
  local success = DepositMoney(data.amount)
  
  cb({
    success = success,
    message = success and "success" or "insufficient_cash"
  })
  
  -- Atualizar dados após operação
  if success then
    SendBankDataToUI()
  end
end)
```

### Callbacks Disponíveis

#### Gerais
- `close` - Fechar UI
- `logout` - Logout do sistema

#### Transações
- `deposit` - Depositar dinheiro (params: `amount`)
- `withdraw` - Sacar dinheiro (params: `amount`)
- `transfer` - Transferir para outro jogador (params: `targetIdentifier`, `amount`)

#### Empréstimos
- `requestLoan` - Solicitar empréstimo (params: `amount`)
- `payLoan` - Pagar empréstimo (params: `loanId`, `amount?`)
- `cancelLoan` - Cancelar empréstimo (params: `loanId`)

#### Faturas
- `payInvoice` - Pagar fatura (params: `invoiceId`)
- `declineInvoice` - Recusar fatura (params: `invoiceId`)

#### Cartões
- `createCard` - Criar cartão (params: `pin`, `cardType`)
- `changeCardPin` - Alterar PIN (params: `cardId`, `oldPin`, `newPin`)
- `setCardStatus` - Bloquear/ativar (params: `cardId`, `status`)

#### Sociedade
- `depositSociety` - Depositar na sociedade (params: `amount`)
- `withdrawSociety` - Sacar da sociedade (params: `amount`)
- `transferToSociety` - Transferir para sociedade (params: `amount`)
- `transferFromSociety` - Transferir da sociedade (params: `amount`)

#### Contas Compartilhadas
- `createSharedAccount` - Criar conta (params: `accountName`)
- `depositShared` - Depositar (params: `accountId`, `amount`)
- `withdrawShared` - Sacar (params: `accountId`, `amount`)
- `addSharedMember` - Adicionar membro (params: `accountId`, `targetIdentifier`)
- `removeSharedMember` - Remover membro (params: `accountId`, `targetIdentifier`)

#### Poupança
- `depositSavings` - Depositar na poupança (params: `amount`)
- `withdrawSavings` - Sacar da poupança (params: `amount`)

### Formato de Resposta

Todas as callbacks devem retornar:

```lua
{
  success = true,  -- boolean
  message = "success",  -- string (chave de tradução)
  data = {}  -- optional, dados adicionais
}
```

### Mensagens de Erro Traduzidas

A UI já possui traduções para as seguintes chaves de erro:

```typescript
insufficient_funds
invalid_amount
player_not_found
invalid_player
transfer_failed
loan_denied
invoice_not_found
card_limit_reached
insufficient_permissions
account_not_found
error (mensagem genérica)
```

## 🎯 Tecnologias Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **TailwindCSS v4** - Estilização moderna
- **Motion (Framer Motion)** - Animações
- **Lucide React** - Ícones
- **Sonner** - Toast notifications
- **Vite** - Build tool

## 📱 Compatibilidade

- ✅ **CEF (Chromium Embedded Framework)** - Totalmente compatível
- ✅ **Resolução 1920x1080** - Otimizado
- ✅ **Responsivo** - Funciona em diferentes resoluções
- ⚠️ **backdrop-filter** não é usado (incompatível com CEF)

## 🛠️ Desenvolvimento

```bash
# Modo desenvolvimento (com hot reload)
pnpm dev

# Type checking
pnpm type-check

# Build
pnpm build

# Preview do build
pnpm preview
```

### Estrutura de Pastas

```
src/
├── app/
│   ├── components/
│   │   ├── sections/       # Seções principais
│   │   ├── ui/             # Componentes UI base
│   │   ├── BankHeader.tsx
│   │   ├── BankSidebar.tsx
│   │   └── ...
│   └── App.tsx             # App principal
├── types/
│   └── bank.ts             # Tipos TypeScript
├── utils/
│   └── nui.ts              # Utilitários NUI
└── styles/
    ├── index.css
    ├── theme.css           # Tokens de design
    └── fonts.css
```

## 📝 Tipos de Dados

Veja `/src/types/bank.ts` para a definição completa de todos os tipos TypeScript usados na aplicação.

Principais interfaces:
- `BankOpenData` - Dados completos do banco
- `Transaction` - Transação bancária
- `Loan` - Empréstimo
- `Invoice` - Fatura
- `Card` - Cartão
- `SharedAccount` - Conta compartilhada
- `SavingsAccount` - Conta poupança
- `BankConfig` - Configurações do sistema

## 🎨 Customização

### Cores e Tema

Edite `/src/styles/theme.css` para customizar as cores do tema:

```css
:root {
  --color-primary: oklch(0.7 0.2 270);  /* Roxo principal */
  --color-secondary: oklch(0.65 0.25 250);  /* Azul secundário */
  /* ... */
}
```

### Moeda

A moeda é configurada dinamicamente via `config.currency` nos dados do servidor.

## 🐛 Debug

Para testar localmente sem FiveM:

1. Uncomment o bloco de mock data em `App.tsx` (linhas 27-146)
2. Altere `visible` inicial para `true` (linha 21)
3. Execute `pnpm dev`

**⚠️ IMPORTANTE:** Remova os dados mock antes de fazer o build para produção!

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues e pull requests.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📧 Suporte

Para questões e suporte, abra uma [issue no GitHub](https://github.com/seu-usuario/phantom_bank_nui/issues).

## 🙏 Créditos

Desenvolvido com ❤️ para a comunidade FiveM.

---

**Nota:** Este é apenas o NUI (interface). Você precisará implementar a lógica do servidor (Lua) separadamente para que tudo funcione.
