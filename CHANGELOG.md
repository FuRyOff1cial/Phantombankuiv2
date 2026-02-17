# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-17

### 🎉 Lançamento Inicial

#### ✨ Adicionado

**Dashboard**
- Visualização de saldo banco e dinheiro em mãos
- Sistema de credit score com indicadores visuais
- Histórico completo de transações com paginação
- Operações rápidas de depósito e saque
- Cards animados com estatísticas

**Transferências**
- Sistema de transferência entre jogadores
- Cálculo automático de taxas
- Validação de limites e saldos
- Preview do valor líquido após taxa
- Animações de loading durante operações

**Cartões**
- Criação de cartões (debit, gold, express)
- Cartões holográficos 3D animados
- Sistema de PIN de 4 dígitos
- Alteração de PIN com validação
- Bloqueio e desbloqueio de cartões
- Visualização de detalhes (toggle show/hide)

**Faturas (Invoices)**
- Visualização de faturas recebidas
- Sistema de pagamento de faturas
- Recusa de faturas com confirmação
- Indicadores de status (pending/paid/cancelled)
- Sistema de expiração automático

**Empréstimos (Loans)**
- Solicitação de empréstimos baseada em credit score
- Visualização de empréstimos ativos
- Pagamento parcial ou total
- Cancelamento de empréstimos pendentes
- Indicadores de dias restantes
- Cálculo de juros e próxima parcela

**Contas de Sociedade (Society)**
- Acesso baseado em job/cargo
- Depósito e saque de dinheiro
- Transferências entre banco pessoal e sociedade
- Visualização de saldo da organização
- Validação de permissões

**Contas Compartilhadas (Shared Accounts)**
- Criação de contas conjuntas
- Sistema de permissões (owner/member)
- Adição e remoção de membros
- Depósito e saque colaborativo
- Gestão de múltiplas contas

**Contas Poupança (Savings)**
- Sistema de juros automáticos
- Depósito e saque
- Visualização de rendimentos totais e acumulados
- Indicador de próximo rendimento
- Diferentes frequências (daily/weekly/monthly)

**UI/UX**
- Design escuro estilo GTA RP
- Gradientes roxo/azul em toda interface
- Animações suaves com Motion (Framer Motion)
- Efeitos glassmorphism compatíveis com CEF
- Sistema de notificações toast elegante
- Loading states em todas operações
- Sidebar com navegação intuitiva
- Header com informações do player
- Responsivo para diferentes resoluções

**Técnico**
- TypeScript completo com types seguros
- TailwindCSS v4 para estilização
- Comunicação NUI via window.postMessage
- Fetch para callbacks do FiveM
- Sistema de tradução de erros
- Validações client-side
- Otimizado para CEF/Chromium
- GPU acceleration para animações

#### 🔧 Correções

- Removido uso de `backdrop-filter` (incompatível com CEF)
- Substituído por técnicas de blur compatíveis
- Otimizado rendering de listas longas
- Melhorado performance de animações

#### 📚 Documentação

- README completo com guia de uso
- INTEGRATION_GUIDE com exemplos de código
- Documentação de todos os tipos TypeScript
- Exemplos de callbacks Lua
- Checklist de implementação

#### 🎨 Design

- Sistema de design tokens consistente
- Cores e gradientes padronizados
- Componentes reutilizáveis
- Iconografia com Lucide React
- Tipografia otimizada

---

## 🔮 Próximas Versões

### [1.1.0] - Planejado

- [ ] Business/Company accounts
- [ ] Export/import de transações (CSV)
- [ ] Gráficos de gastos mensais
- [ ] Notificações in-app
- [ ] Histórico de faturas enviadas
- [ ] Sistema de metas de economia
- [ ] Calculadora de empréstimos
- [ ] Suporte a múltiplas moedas

### [1.2.0] - Futuro

- [ ] Modo ATM limitado
- [ ] Autenticação de dois fatores
- [ ] Transferências agendadas
- [ ] Pagamentos recorrentes
- [ ] QR Code para transferências
- [ ] Integração com crypto
- [ ] Sistema de cashback
- [ ] Programa de pontos

---

**Legenda:**
- ✨ Adicionado - Novas features
- 🔧 Correções - Bug fixes
- 🎨 Design - Mudanças visuais
- 📚 Documentação - Melhorias na documentação
- ⚡ Performance - Otimizações
- 🔒 Segurança - Correções de segurança
- 🗑️ Removido - Features removidas
- 📦 Dependências - Atualizações de pacotes
