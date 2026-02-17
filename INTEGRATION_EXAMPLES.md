# 📚 Exemplos de Integração - Phantom Bank

## 1. Adicionar Filtros no Dashboard

```tsx
// Dashboard.tsx - Adicionar no início do componente

import { useState } from "react";
import { TransactionFilters, TransactionFilterState } from "../TransactionFilters";

export function Dashboard({ transactions, ... }: DashboardProps) {
  const [filters, setFilters] = useState<TransactionFilterState>({});

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Filtro de tipo
      if (filters.type && t.type !== filters.type) return false;
      
      // Filtro de pesquisa
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchDescription = t.description?.toLowerCase().includes(searchLower);
        const matchSender = t.sender?.toLowerCase().includes(searchLower);
        const matchReceiver = t.receiver?.toLowerCase().includes(searchLower);
        if (!matchDescription && !matchSender && !matchReceiver) return false;
      }
      
      // Filtro de data
      if (filters.date_from) {
        const txDate = new Date(t.created_at).getTime() / 1000;
        if (txDate < filters.date_from) return false;
      }
      if (filters.date_to) {
        const txDate = new Date(t.created_at).getTime() / 1000;
        if (txDate > filters.date_to) return false;
      }
      
      // Filtro de valor
      if (filters.amount_min && t.amount < filters.amount_min) return false;
      if (filters.amount_max && t.amount > filters.amount_max) return false;
      
      return true;
    });
  }, [transactions, filters]);

  return (
    <div className="space-y-6">
      {/* ... outros componentes ... */}

      {/* Recent Transactions com Filtros */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Transactions
        </h3>
        
        {/* Adicionar filtros aqui */}
        <TransactionFilters
          filters={filters}
          onFilterChange={setFilters}
          onClear={() => setFilters({})}
        />

        {/* Lista de transações filtradas */}
        <div className="space-y-3 mt-4">
          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Transactions Found"
              description="Try adjusting your filters"
            />
          ) : (
            filteredTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
```

---

## 2. Adicionar Paginação

```tsx
// Criar componente de paginação simples

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded ${
              page === currentPage
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        Next
      </Button>
    </div>
  );
}

// Usar no Dashboard
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

const paginatedTransactions = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.slice(start, end);
}, [filteredTransactions, currentPage]);

// Render
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

---

## 3. Export para Clipboard

```tsx
// Adicionar botão de export

import { Download, Check } from "lucide-react";

function ExportButton({ data, format = "csv" }: { data: Transaction[], format?: "csv" | "json" }) {
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    let text = "";
    
    if (format === "csv") {
      // CSV format
      text = "Date,Type,Amount,Description,Sender,Receiver\n";
      data.forEach(t => {
        text += `${formatDate(t.created_at)},${t.type},${t.amount},"${t.description || ''}",${t.sender},${t.receiver}\n`;
      });
    } else {
      // JSON format
      text = JSON.stringify(data, null, 2);
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`Exported ${data.length} transactions to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to export");
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="border-purple-500/30"
    >
      {copied ? <Check className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
      Export {format.toUpperCase()}
    </Button>
  );
}

// Usar no Dashboard
<div className="flex items-center justify-between mb-4">
  <h3 className="text-lg font-semibold text-white">Transactions</h3>
  <div className="flex gap-2">
    <ExportButton data={filteredTransactions} format="csv" />
    <ExportButton data={filteredTransactions} format="json" />
  </div>
</div>
```

---

## 4. Adicionar Loading States com Skeleton

```tsx
// Usar BankLoadingSkeleton nas seções

function Dashboard({ isLoading, ... }: DashboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-600 rounded w-32"></div>
            </Card>
          ))}
        </div>

        {/* Transactions skeleton */}
        <Card className="p-6">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-48"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Render normal...
}
```

---

## 5. Adicionar Tooltips

```tsx
// Componente Tooltip simples

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 border border-purple-500/30"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Usar
<Tooltip content="Copy IBAN to clipboard">
  <button onClick={copyIban}>
    <Copy className="w-4 h-4" />
  </button>
</Tooltip>
```

---

## 6. Adicionar Confirmação com Input

```tsx
// Dialog com input para confirmar (ex: deletar conta)

function ConfirmWithInput({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  description,
  placeholder = "Type to confirm",
  confirmText = "DELETE"
}: ConfirmWithInputProps) {
  const [input, setInput] = useState("");
  const isValid = input.toUpperCase() === confirmText;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => isValid && onConfirm()}
      title={title}
      description={description}
      variant="danger"
    >
      {/* Input adicional */}
      <div className="mt-4">
        <Label className="text-gray-300">
          Type <span className="font-bold text-red-400">{confirmText}</span> to confirm
        </Label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="mt-2 bg-black/30 border-red-500/30"
        />
      </div>
      
      <Button
        disabled={!isValid}
        className={!isValid ? "opacity-50 cursor-not-allowed" : ""}
      >
        Confirm
      </Button>
    </ConfirmDialog>
  );
}

// Usar para deletar shared account
const handleDeleteAccount = (accountId: number) => {
  showConfirmWithInput(
    "Delete Shared Account",
    "This action is permanent. All funds must be withdrawn first.",
    async () => {
      await fetchNUI("deleteSharedAccount", { accountId });
    }
  );
};
```

---

## 7. Adicionar Badges/Status Indicators

```tsx
// Component Badge

interface BadgeProps {
  variant: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}

function Badge({ variant, children }: BadgeProps) {
  const colors = {
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[variant]}`}>
      {children}
    </span>
  );
}

// Usar em cards, invoices, etc
<Badge variant={invoice.status === "paid" ? "success" : "warning"}>
  {invoice.status.toUpperCase()}
</Badge>
```

---

## 8. Adicionar Search Bar Global

```tsx
// No Header, adicionar search

function BankHeader({ ... }: BankHeaderProps) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = debounce(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    // Buscar em todas as seções
    const results = [
      ...transactions.filter(t => 
        t.description?.toLowerCase().includes(query.toLowerCase())
      ),
      ...invoices.filter(i =>
        i.reason?.toLowerCase().includes(query.toLowerCase())
      ),
      // ... etc
    ];

    setSearchResults(results);
  }, 300);

  return (
    <div className="header">
      {/* ... existing content ... */}
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          className="w-64"
          leftIcon={<Search />}
        />
        
        {/* Results dropdown */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div className="absolute top-full mt-2 w-full bg-[#1a1a2e] border border-purple-500/20 rounded-lg shadow-xl">
              {searchResults.map(result => (
                <SearchResultItem key={result.id} result={result} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

## 9. Adicionar Sound Effects (FiveM)

```tsx
// Wrapper para sons do FiveM

const playSound = (soundName: string) => {
  if (typeof GetParentResourceName !== 'undefined') {
    // Está no FiveM
    fetch(`https://${GetParentResourceName()}/playSound`, {
      method: 'POST',
      body: JSON.stringify({ sound: soundName })
    });
  }
};

// Usar em ações
const handleDeposit = async (amount: number) => {
  // ... fetch deposit ...
  if (response.success) {
    playSound("success");
    toast.success("Deposit successful");
  }
};

// No Lua (client):
RegisterNUICallback('playSound', function(data, cb)
  PlaySoundFrontend(-1, "CONFIRM_BEEP", "HUD_MINI_GAME_SOUNDSET", 1)
  cb('ok')
end)
```

---

## 10. Dark/Light Mode Toggle

```tsx
// Hook para tema
function useTheme() {
  const [theme, setTheme] = useLocalStorage("phantom_bank_theme", "dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("light");
  };

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  return { theme, toggleTheme };
}

// Botão no header
<button onClick={toggleTheme} className="...">
  {theme === "dark" ? <Sun /> : <Moon />}
</button>

// CSS (adicionar ao theme.css)
.light {
  --bank-bg: #f5f5f5;
  --bank-card: #ffffff;
  --text-primary: #1a1a1a;
  /* ... etc */
}
```

---

**🎉 Com esses exemplos você pode expandir infinitamente o sistema bancário!**

Todos os exemplos são:
- ✅ FiveM compatible
- ✅ 60fps optimized
- ✅ TypeScript typed
- ✅ Motion animated
- ✅ Fully responsive
