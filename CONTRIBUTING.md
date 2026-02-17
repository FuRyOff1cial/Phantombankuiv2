# 🤝 Contributing to Phantom Bank NUI

Obrigado por considerar contribuir para o Phantom Bank! Contribuições são muito bem-vindas.

## 📋 Code of Conduct

Seja respeitoso e profissional. Não toleramos:
- Linguagem ofensiva ou discriminatória
- Assédio de qualquer tipo
- Comportamento não profissional

## 🚀 Como Contribuir

### 🐛 Reportar Bugs

Ao reportar bugs, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir** o bug
3. **Resultado esperado** vs **resultado atual**
4. **Screenshots** (se aplicável)
5. **Ambiente:**
   - Framework (ESX/QBCore/Custom)
   - Versão do FiveM
   - Versão do recurso
6. **Logs de erro** (F8, server console)

**Template de Issue:**
```markdown
**Descrição:**
[Descreva o bug]

**Passos para Reproduzir:**
1. Abrir o banco
2. Clicar em...
3. ...

**Esperado:**
[O que deveria acontecer]

**Atual:**
[O que está acontecendo]

**Ambiente:**
- Framework: ESX 1.10.0
- FiveM: Build 6683
- Versão: 1.0.0

**Logs:**
```
[Erro aqui]
```
```

### ✨ Sugerir Features

Ao sugerir novas funcionalidades:

1. **Verifique** se já não existe uma issue similar
2. **Explique** o caso de uso
3. **Descreva** como deveria funcionar
4. **Adicione mockups** (se possível)

**Template de Feature Request:**
```markdown
**Feature:**
[Nome da feature]

**Caso de Uso:**
[Por que isso é útil]

**Descrição:**
[Como deveria funcionar]

**Mockups:**
[Imagens, se houver]

**Alternativas:**
[Outras soluções consideradas]
```

### 🔧 Pull Requests

#### Preparação

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/seu-usuario/phantom_bank_nui.git
   ```
3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```

#### Desenvolvimento

1. **Instale as dependências:**
   ```bash
   pnpm install
   ```

2. **Desenvolva** sua feature/fix

3. **Teste localmente:**
   ```bash
   pnpm dev
   ```

4. **Build para produção:**
   ```bash
   pnpm build
   ```

5. **Verifique tipos TypeScript:**
   ```bash
   pnpm type-check
   ```

#### Commit

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: adiciona filtro de transações por tipo"

# Bug fixes
git commit -m "fix: corrige loading state em transferências"

# Documentation
git commit -m "docs: atualiza guia de integração"

# Styling
git commit -m "style: melhora espaçamento no dashboard"

# Refactoring
git commit -m "refactor: otimiza renderização de cards"

# Performance
git commit -m "perf: reduz re-renders desnecessários"
```

**Tipos de commit:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação, estilos
- `refactor:` Refatoração de código
- `perf:` Melhorias de performance
- `test:` Testes
- `chore:` Manutenção, configs

#### Push e PR

1. **Push** para seu fork:
   ```bash
   git push origin feature/minha-feature
   ```

2. **Abra um Pull Request** no GitHub

3. **Preencha o template** do PR:
   - Descrição da mudança
   - Issue relacionada (se houver)
   - Tipo de mudança (feature/fix/docs)
   - Checklist de testes

**Template de Pull Request:**
```markdown
## Descrição
[Descreva suas mudanças]

## Issue Relacionada
Closes #123

## Tipo de Mudança
- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## Testes
- [ ] Testado localmente
- [ ] Build funciona
- [ ] Sem erros TypeScript
- [ ] Testado in-game (se aplicável)

## Screenshots
[Se aplicável]

## Checklist
- [ ] Código segue o estilo do projeto
- [ ] Comentários adicionados onde necessário
- [ ] Documentação atualizada
- [ ] Sem warnings ou erros
- [ ] Testado em diferentes resoluções (se UI)
```

## 🎨 Padrões de Código

### TypeScript

```typescript
// ✅ Use tipos explícitos
function handleDeposit(amount: number): Promise<void> {
  // ...
}

// ✅ Use interfaces para objetos
interface BankData {
  balance: number;
  cash: number;
}

// ✅ Use enums para valores fixos
enum TransactionType {
  Deposit = "deposit",
  Withdraw = "withdraw",
  Transfer = "transfer"
}

// ❌ Evite any
const data: any = {};  // Não faça isso

// ✅ Use tipos específicos
const data: BankData = {};
```

### React/JSX

```tsx
// ✅ Functional components com tipos
interface DashboardProps {
  balance: number;
  onDeposit: (amount: number) => void;
}

export function Dashboard({ balance, onDeposit }: DashboardProps) {
  // ...
}

// ✅ Use hooks apropriadamente
const [amount, setAmount] = useState<number>(0);

// ✅ useEffect com dependências corretas
useEffect(() => {
  fetchData();
}, [dependency]);

// ✅ Event handlers tipados
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

### CSS/Tailwind

```tsx
// ✅ Classes organizadas e legíveis
<div className="flex items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg">

// ✅ Use o sistema de design tokens
<div className="bg-primary text-white">

// ❌ Evite inline styles (use quando necessário)
<div style={{ backgroundColor: 'red' }}>  // Prefira Tailwind

// ✅ Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Nomeação

```typescript
// ✅ camelCase para variáveis e funções
const userName = "John";
function getUserData() {}

// ✅ PascalCase para componentes e tipos
interface UserData {}
function UserProfile() {}

// ✅ UPPER_CASE para constantes
const MAX_TRANSFER_AMOUNT = 50000;

// ✅ Nomes descritivos
const handleDeposit = () => {};  // ✅
const h = () => {};              // ❌
```

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── components/
│   │   ├── sections/          # Seções principais (Dashboard, Transfer, etc)
│   │   ├── ui/                # Componentes UI base (Button, Card, etc)
│   │   ├── BankHeader.tsx     # Header específico
│   │   └── BankSidebar.tsx    # Sidebar específico
│   └── App.tsx                # Componente principal
├── types/
│   └── bank.ts                # Tipos TypeScript
├── utils/
│   └── nui.ts                 # Utilitários NUI
└── styles/
    ├── index.css              # Imports globais
    ├── theme.css              # Tokens de design
    └── fonts.css              # Fontes
```

## 🧪 Testes

### Manual Testing

Antes de submeter PR, teste:

1. **UI Responsiveness**
   - [ ] 1920x1080
   - [ ] 1366x768
   - [ ] 2560x1440

2. **Funcionalidades**
   - [ ] Todas as seções abrem
   - [ ] Botões funcionam
   - [ ] Inputs validam corretamente
   - [ ] Loading states aparecem
   - [ ] Toast notifications funcionam

3. **Performance**
   - [ ] Sem lag perceptível
   - [ ] Animações suaves
   - [ ] Sem memory leaks

### In-Game Testing (se aplicável)

- [ ] Funciona no CEF
- [ ] ESC fecha a UI
- [ ] Callbacks comunicam corretamente
- [ ] Sem erros no F8

## 📚 Documentação

Ao adicionar features:

1. **Atualize o README.md** se necessário
2. **Adicione comentários** no código
3. **Atualize INTEGRATION_GUIDE.md** para novas callbacks
4. **Documente tipos** TypeScript
5. **Adicione ao CHANGELOG.md**

Exemplo de documentação:

```typescript
/**
 * Handles deposit transaction
 * 
 * @param amount - Amount to deposit (must be positive)
 * @returns Promise that resolves when deposit is complete
 * @throws {Error} If amount is invalid or insufficient cash
 * 
 * @example
 * ```ts
 * await handleDeposit(1000);
 * ```
 */
async function handleDeposit(amount: number): Promise<void> {
  // ...
}
```

## 🎯 Prioridades

O que procuramos:

**Alta prioridade:**
- 🐛 Bug fixes críticos
- 🔒 Correções de segurança
- 📱 Melhorias de responsividade
- ⚡ Otimizações de performance

**Média prioridade:**
- ✨ Novas features documentadas
- 🎨 Melhorias de UI/UX
- ♿ Melhorias de acessibilidade
- 📚 Melhorias na documentação

**Baixa prioridade:**
- 🧹 Refactoring sem benefício claro
- 🎭 Mudanças puramente estéticas
- 📦 Atualização de dependências sem motivo

## ❌ O que Evitar

- ❌ PRs muito grandes (quebre em PRs menores)
- ❌ Mudanças sem explicação
- ❌ Código não testado
- ❌ Breaking changes sem discussão prévia
- ❌ Adicionar dependências desnecessárias
- ❌ Remover features sem consenso
- ❌ Ignorar o style guide do projeto

## ✅ Checklist Final

Antes de submeter PR:

- [ ] Código funciona localmente
- [ ] Build funciona (`pnpm build`)
- [ ] Sem erros TypeScript (`pnpm type-check`)
- [ ] Código segue os padrões do projeto
- [ ] Commits seguem Conventional Commits
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] PR description completa
- [ ] Screenshots adicionadas (se UI)
- [ ] Testado em diferentes cenários

## 💬 Comunicação

- **GitHub Issues** - Para bugs e features
- **GitHub Discussions** - Para perguntas e ideias
- **Pull Requests** - Para contribuições de código

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT License).

## 🙏 Agradecimentos

Obrigado por contribuir para o Phantom Bank! Sua ajuda torna este projeto melhor para toda a comunidade FiveM.

---

**Dúvidas?** Abra uma Discussion no GitHub ou comente na issue relevante.
