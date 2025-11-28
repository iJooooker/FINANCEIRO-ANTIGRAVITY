import React, { useState, useEffect, useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  Home,
  List,
  Target,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Wallet,
  Moon,
  Sun,
  LogOut,
  User,
  Lock,
  Mail
} from 'lucide-react';

// Import Supabase client
import { supabase } from './supabaseClient';

// --- CSS VARIABLES & THEME ---
const cssVariables = `
:root {
  --background: oklch(1.0000 0 0);
  --foreground: oklch(0.1884 0.0128 248.5103);
  --card: oklch(0.9784 0.0011 197.1387);
  --card-foreground: oklch(0.1884 0.0128 248.5103);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.1884 0.0128 248.5103);
  --primary: oklch(0.6723 0.1606 244.9955);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.1884 0.0128 248.5103);
  --secondary-foreground: oklch(1.0000 0 0);
  --muted: oklch(0.9222 0.0013 286.3737);
  --muted-foreground: oklch(0.1884 0.0128 248.5103);
  --accent: oklch(0.9392 0.0166 250.8453);
  --accent-foreground: oklch(0.6723 0.1606 244.9955);
  --destructive: oklch(0.6188 0.2376 25.7658);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.9317 0.0118 231.6594);
  --input: oklch(0.9809 0.0025 228.7836);
  --ring: oklch(0.6818 0.1584 243.3540);
  --chart-1: oklch(0.6723 0.1606 244.9955);
  --chart-2: oklch(0.6907 0.1554 160.3454);
  --chart-3: oklch(0.8214 0.1600 82.5337);
  --chart-4: oklch(0.7064 0.1822 151.7125);
  --chart-5: oklch(0.5919 0.2186 10.5826);
  --sidebar: oklch(0.9784 0.0011 197.1387);
  --sidebar-foreground: oklch(0.1884 0.0128 248.5103);
  --sidebar-primary: oklch(0.6723 0.1606 244.9955);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.9392 0.0166 250.8453);
  --sidebar-accent-foreground: oklch(0.6723 0.1606 244.9955);
  --sidebar-border: oklch(0.9271 0.0101 238.5177);
  --sidebar-ring: oklch(0.6818 0.1584 243.3540);
  --radius: 0.75rem;
}

.dark {
  --background: oklch(0 0 0);
  --foreground: oklch(0.9328 0.0025 228.7857);
  --card: oklch(0.2097 0.0080 274.5332);
  --card-foreground: oklch(0.8853 0 0);
  --popover: oklch(0 0 0);
  --popover-foreground: oklch(0.9328 0.0025 228.7857);
  --primary: oklch(0.6692 0.1607 245.0110);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9622 0.0035 219.5331);
  --secondary-foreground: oklch(0.1884 0.0128 248.5103);
  --muted: oklch(0.2090 0 0);
  --muted-foreground: oklch(0.5637 0.0078 247.9662);
  --accent: oklch(0.1928 0.0331 242.5459);
  --accent-foreground: oklch(0.6692 0.1607 245.0110);
  --destructive: oklch(0.6188 0.2376 25.7658);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.2674 0.0047 248.0045);
  --input: oklch(0.3020 0.0288 244.8244);
  --ring: oklch(0.6818 0.1584 243.3540);
  --chart-1: oklch(0.6723 0.1606 244.9955);
  --chart-2: oklch(0.6907 0.1554 160.3454);
  --chart-3: oklch(0.8214 0.1600 82.5337);
  --chart-4: oklch(0.7064 0.1822 151.7125);
  --chart-5: oklch(0.5919 0.2186 10.5826);
  --sidebar: oklch(0.2097 0.0080 274.5332);
  --sidebar-foreground: oklch(0.8853 0 0);
  --sidebar-primary: oklch(0.6818 0.1584 243.3540);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.1928 0.0331 242.5459);
  --sidebar-accent-foreground: oklch(0.6692 0.1607 245.0110);
  --sidebar-border: oklch(0.3795 0.0220 240.5943);
  --sidebar-ring: oklch(0.6818 0.1584 243.3540);
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--muted);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--muted-foreground);
  border-radius: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
`;

// --- COMPONENTES AUXILIARES ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auth State
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Estado da UI
  const [currentView, setCurrentView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Estado do Formulário
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'),
    category: 'Geral'
  });

  // --- AUTENTICAÇÃO E DADOS ---

  const fetchTransactions = async (showLoading = true) => {
    if (!user) return;
    if (showLoading) setLoading(true);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) console.error('Error fetching transactions:', error);
    else setTransactions(data || []);

    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) setLoading(false);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Conta criada! Verifique seu email para confirmar (se necessário) ou faça login.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    fetchTransactions(true);

    // Realtime subscription
    const channel = supabase
      .channel('transactions_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setTransactions(prev => {
            // Avoid duplicate if already added locally
            if (prev.some(t => t.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // --- LÓGICA DE NEGÓCIO ---
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!user || !newTransaction.amount || !newTransaction.description) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            description: newTransaction.description,
            amount: parseFloat(newTransaction.amount),
            type: newTransaction.type,
            date: newTransaction.date,
            category: newTransaction.category
          }
        ])
        .select();

      if (error) throw error;

      // Update local state immediately for instant feedback
      if (data) {
        setTransactions(prev => [data[0], ...prev]);
      }

      // Removed fetchTransactions(false) to prevent race condition

      setIsModalOpen(false);
      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        date: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'), // YYYY-MM-DD in local time
        category: 'Geral'
      });
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao salvar transação. Verifique se a tabela 'transactions' existe.");
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;
    if (window.confirm("Tem certeza que deseja excluir?")) {
      // Optimistic update: remove immediately from UI
      setTransactions(prev => prev.filter(t => t.id !== id));

      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
          // Optionally revert state here if needed, but for now we keep it simple
        }
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao deletar. A página será recarregada.");
        window.location.reload(); // Fallback to sync state
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date); // Supabase date is YYYY-MM-DD string usually, works with Date constructor
      const tYear = tDate.getUTCFullYear();
      const tMonth = tDate.getUTCMonth();
      if (currentView === 'economy') return tYear === selectedYear;
      return tYear === selectedYear && tMonth === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth, currentView]);

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const economyData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const yearTransactions = transactions.filter(t => new Date(t.date).getUTCFullYear() === selectedYear);
    return months.map((monthName, index) => {
      const monthTrans = yearTransactions.filter(t => new Date(t.date).getUTCMonth() === index);
      const income = monthTrans.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
      const expense = monthTrans.filter(t => t.type === 'expense').reduce((acc, c) => acc + c.amount, 0);
      const savings = income - expense;
      const percentage = income > 0 ? (savings / income) * 100 : 0;
      return {
        name: monthName,
        Entradas: income,
        Economia: savings,
        Porcentagem: percentage.toFixed(1)
      };
    });
  }, [transactions, selectedYear]);

  const chartData = [
    { name: 'Entradas', value: summary.income, fill: 'var(--chart-2)' },
    { name: 'Saídas', value: summary.expense, fill: 'var(--chart-5)' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] p-4 text-center transition-colors duration-300">
        <style>{cssVariables}</style>
        <div className="bg-[--card] p-8 rounded-[--radius] shadow-lg border border-[--border] max-w-md w-full animate-fade-in">
          <div className="bg-[--primary] p-4 rounded-full inline-block mb-6 shadow-lg">
            <Wallet className="text-[--primary-foreground] w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-[--card-foreground] mb-2">
            {authMode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="text-[--muted-foreground] mb-8">
            {authMode === 'login' ? 'Entre para gerenciar suas finanças.' : 'Comece a controlar seus gastos hoje.'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-[--muted-foreground] mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[--muted-foreground] w-5 h-5" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full p-3 pl-10 bg-[--background] border border-[--input] rounded-lg focus:ring-2 focus:ring-[--ring] focus:outline-none transition text-[--foreground]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[--muted-foreground] mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[--muted-foreground] w-5 h-5" />
                <input
                  type="password"
                  required
                  placeholder="******"
                  className="w-full p-3 pl-10 bg-[--background] border border-[--input] rounded-lg focus:ring-2 focus:ring-[--ring] focus:outline-none transition text-[--foreground]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[--primary] text-[--primary-foreground] font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar' : 'Cadastrar')}
            </button>
          </form>

          <div className="mt-6 text-sm text-[--muted-foreground]">
            {authMode === 'login' ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-[--primary] font-bold hover:underline"
            >
              {authMode === 'login' ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      <style>{cssVariables}</style>
      <div className="min-h-screen bg-[--background] font-sans text-[--foreground] pb-20 md:pb-0 md:pl-64 transition-colors duration-300">

        {/* SIDEBAR (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-[--sidebar] border-r border-[--sidebar-border] z-10">
          <div className="p-6 flex items-center space-x-2 border-b border-[--sidebar-border]">
            <div className="bg-[--sidebar-primary] p-2 rounded-lg">
              <Wallet className="text-[--sidebar-primary-foreground] w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[--sidebar-foreground]">Finanças</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem icon={<Home size={20} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <SidebarItem icon={<List size={20} />} label="Lançamentos" active={currentView === 'transactions'} onClick={() => setCurrentView('transactions')} />
            <SidebarItem icon={<Target size={20} />} label="Economia Anual" active={currentView === 'economy'} onClick={() => setCurrentView('economy')} />
            <SidebarItem icon={<PieIcon size={20} />} label="Análise" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />
          </nav>

          <div className="p-4 border-t border-[--sidebar-border] space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-[--muted-foreground]">v2.1 • {selectedYear}</div>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[--sidebar-accent] text-[--sidebar-foreground] transition">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1 bg-[--muted]/50 rounded text-xs text-[--muted-foreground] truncate">
              <User size={12} />
              <span className="truncate">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-[--destructive]/10 text-[--destructive] hover:bg-[--destructive]/20 transition text-sm font-medium">
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* HEADER MOBILE */}
        <header className="md:hidden bg-[--card] border-b border-[--border] p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="bg-[--primary] p-1.5 rounded-lg">
              <Wallet className="text-[--primary-foreground] w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-[--foreground]">Finanças</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[--muted] text-[--foreground] transition">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-[--muted] text-[--destructive] transition">
              <LogOut size={20} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[--primary] text-[--primary-foreground] p-2 rounded-full shadow active:scale-95 transition"
            >
              <Plus size={20} />
            </button>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="p-4 max-w-6xl mx-auto space-y-6">

          {/* SELETOR DE PERÍODO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[--card] p-4 rounded-[--radius] shadow-sm border border-[--border]">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSelectedYear(y => y - 1)} className="p-1 hover:bg-[--accent] text-[--foreground] rounded"><ChevronLeft size={20} /></button>
              <span className="font-bold text-xl text-[--foreground]">{selectedYear}</span>
              <button onClick={() => setSelectedYear(y => y + 1)} className="p-1 hover:bg-[--accent] text-[--foreground] rounded"><ChevronRight size={20} /></button>
            </div>

            {currentView !== 'economy' && (
              <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar space-x-2">
                {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(i)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedMonth === i
                      ? 'bg-[--primary] text-[--primary-foreground]'
                      : 'bg-[--muted] text-[--muted-foreground] hover:bg-[--accent] hover:text-[--accent-foreground]'
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- VIEW: DASHBOARD --- */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                  title="Entradas"
                  value={summary.income}
                  icon={<TrendingUp className="text-[--chart-2]" />}
                  valueColor="text-[--chart-2]"
                />
                <SummaryCard
                  title="Saídas"
                  value={summary.expense}
                  icon={<TrendingDown className="text-[--chart-5]" />}
                  valueColor="text-[--chart-5]"
                />
                <SummaryCard
                  title="Saldo Atual"
                  value={summary.balance}
                  icon={<DollarSign className="text-[--chart-1]" />}
                  valueColor={summary.balance >= 0 ? "text-[--chart-1]" : "text-[--chart-5]"}
                />
              </div>

              {/* Gráfico Rápido e Últimas Transações */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[--card] p-6 rounded-[--radius] shadow-sm border border-[--border]">
                  <h3 className="text-lg font-bold mb-4 text-[--card-foreground]">Visão Geral do Mês</h3>
                  <div className="h-64">
                    {summary.income === 0 && summary.expense === 0 ? (
                      <div className="h-full flex items-center justify-center text-[--muted-foreground]">Sem dados este mês</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="var(--background)"
                            strokeWidth={2}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--card-foreground)' }}
                          />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="bg-[--card] p-6 rounded-[--radius] shadow-sm border border-[--border] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[--card-foreground]">Recentes</h3>
                    <button onClick={() => setCurrentView('transactions')} className="text-sm text-[--primary] font-medium hover:underline">Ver tudo</button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 max-h-64 pr-2 custom-scrollbar">
                    {filteredTransactions.length === 0 ? (
                      <p className="text-[--muted-foreground] text-center py-4">Nenhuma transação.</p>
                    ) : (
                      filteredTransactions.slice(0, 5).map(t => (
                        <TransactionRow key={t.id} transaction={t} onDelete={handleDelete} compact />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: TRANSACTIONS (LISTA) --- */}
          {currentView === 'transactions' && (
            <div className="bg-[--card] rounded-[--radius] shadow-sm border border-[--border] overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-[--border] flex justify-between items-center bg-[--muted]/30">
                <h3 className="font-bold text-[--card-foreground]">Extrato Detalhado</h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:flex items-center space-x-2 bg-[--primary] text-[--primary-foreground] px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
                >
                  <Plus size={16} />
                  <span>Nova Transação</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[--muted-foreground] text-xs uppercase tracking-wider border-b border-[--border]">
                      <th className="p-4 font-medium">Data</th>
                      <th className="p-4 font-medium">Descrição</th>
                      <th className="p-4 font-medium">Categoria</th>
                      <th className="p-4 font-medium text-right">Valor</th>
                      <th className="p-4 font-medium text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--border]">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-[--muted-foreground]">
                          Nenhum lançamento encontrado para este período.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-[--muted]/20 transition-colors group">
                          <td className="p-4 text-sm text-[--muted-foreground] whitespace-nowrap">{formatDate(t.date)}</td>
                          <td className="p-4 text-sm font-medium text-[--foreground]">{t.description}</td>
                          <td className="p-4 text-sm text-[--muted-foreground]">
                            <span className="bg-[--secondary] text-[--secondary-foreground] px-2 py-1 rounded text-xs border border-[--border]">
                              {t.category || 'Geral'}
                            </span>
                          </td>
                          <td className={`p-4 text-sm font-bold text-right whitespace-nowrap ${t.type === 'income' ? 'text-[--chart-2]' : 'text-[--chart-5]'}`}>
                            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="text-[--muted-foreground] hover:text-[--destructive] transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- VIEW: ECONOMY (PLANILHA DE ECONOMIA) --- */}
          {currentView === 'economy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[--card] p-6 rounded-[--radius] shadow-sm border border-[--border]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[--card-foreground]">Economia Anual - {selectedYear}</h3>
                  <div className="text-sm text-[--muted-foreground] bg-[--muted] px-3 py-1 rounded-full border border-[--border]">
                    Total Acumulado: <span className="font-bold text-[--chart-1]">{formatCurrency(economyData.reduce((acc, curr) => acc + curr.Economia, 0))}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[--muted]/50 text-[--muted-foreground] text-xs uppercase tracking-wider">
                        <th className="p-3 rounded-l-lg">Mês</th>
                        <th className="p-3 text-right">Entradas</th>
                        <th className="p-3 text-right">Economia (Saldo)</th>
                        <th className="p-3 text-right rounded-r-lg">% Econ.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[--border]">
                      {economyData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[--muted]/20 transition">
                          <td className="p-3 font-medium text-[--card-foreground]">{row.name}</td>
                          <td className="p-3 text-right text-[--chart-2]">{formatCurrency(row.Entradas)}</td>
                          <td className={`p-3 text-right font-bold ${row.Economia >= 0 ? 'text-[--chart-1]' : 'text-[--chart-5]'}`}>
                            {formatCurrency(row.Economia)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <div className="w-16 h-1.5 bg-[--muted] rounded-full overflow-hidden">
                                <div
                                  className="h-full"
                                  style={{
                                    width: `${Math.max(0, Math.min(100, row.Porcentagem))}%`,
                                    backgroundColor: row.Porcentagem > 20 ? 'var(--chart-2)' : row.Porcentagem > 0 ? 'var(--chart-4)' : 'var(--chart-5)'
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium w-10 text-[--muted-foreground]">{row.Porcentagem}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[--muted]/30 font-bold border-t border-[--border]">
                        <td className="p-3 text-[--card-foreground]">TOTAL</td>
                        <td className="p-3 text-right text-[--chart-2]">
                          {formatCurrency(economyData.reduce((a, b) => a + b.Entradas, 0))}
                        </td>
                        <td className="p-3 text-right text-[--chart-1]">
                          {formatCurrency(economyData.reduce((a, b) => a + b.Economia, 0))}
                        </td>
                        <td className="p-3 text-right">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[--card] p-6 rounded-[--radius] shadow-sm border border-[--border] h-80">
                <h4 className="text-sm font-bold text-[--muted-foreground] uppercase mb-4">Evolução da Economia</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={economyData}>
                    <defs>
                      <linearGradient id="colorEconomia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickFormatter={(value) => `R$${value / 1000}k`} />
                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--card-foreground)' }}
                    />
                    <Area type="monotone" dataKey="Economia" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorEconomia)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* --- VIEW: ANALYTICS (GRÁFICOS) --- */}
          {currentView === 'analytics' && (
            <div className="bg-[--card] p-6 rounded-[--radius] shadow-sm border border-[--border] h-96 animate-fade-in">
              <h3 className="text-lg font-bold mb-6 text-[--card-foreground]">Fluxo de Caixa Mensal</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={economyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <RechartsTooltip
                    cursor={{ fill: 'var(--muted)' }}
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', color: 'var(--card-foreground)' }}
                  />
                  <Legend wrapperStyle={{ color: 'var(--card-foreground)' }} />
                  <Bar dataKey="Entradas" name="Entradas" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Economia" name="Saldo Líquido" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </main>

        {/* --- MENU MOBILE BOTTOM --- */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[--card] border-t border-[--border] flex justify-around p-3 z-30 pb-safe shadow-lg">
          <MobileNavItem icon={<Home size={20} />} label="Início" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <MobileNavItem icon={<List size={20} />} label="Lista" active={currentView === 'transactions'} onClick={() => setCurrentView('transactions')} />
          <div className="w-12"></div> {/* Espaço para o botão FAB */}
          <MobileNavItem icon={<Target size={20} />} label="Anual" active={currentView === 'economy'} onClick={() => setCurrentView('economy')} />
          <MobileNavItem icon={<PieIcon size={20} />} label="Gráficos" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />

          {/* FAB (Floating Action Button) Central */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[--primary] text-[--primary-foreground] p-4 rounded-full shadow-xl hover:opacity-90 active:scale-95 transition-all ring-4 ring-[--background]"
            >
              <Plus size={24} />
            </button>
          </div>
        </nav>

        {/* --- MODAL DE NOVA TRANSAÇÃO --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[--card] w-full max-w-md rounded-[--radius] p-6 shadow-2xl relative animate-slide-up border border-[--border]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[--muted-foreground] hover:text-[--foreground]"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-bold text-[--card-foreground] mb-6">Novo Lançamento</h2>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[--muted-foreground] mb-1">Tipo</label>
                  <div className="flex bg-[--input] p-1 rounded-lg border border-[--border]">
                    <button
                      type="button"
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition ${newTransaction.type === 'expense' ? 'bg-[--background] text-[--chart-5] shadow-sm' : 'text-[--muted-foreground]'}`}
                    >
                      Saída
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition ${newTransaction.type === 'income' ? 'bg-[--background] text-[--chart-2] shadow-sm' : 'text-[--muted-foreground]'}`}
                    >
                      Entrada
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[--muted-foreground] mb-1">Descrição</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Salário, Mercado..."
                    className="w-full p-3 bg-[--background] border border-[--input] rounded-lg focus:ring-2 focus:ring-[--ring] focus:outline-none transition text-[--foreground]"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[--muted-foreground] mb-1">Valor</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[--muted-foreground]">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="0,00"
                        className="w-full p-3 pl-10 bg-[--background] border border-[--input] rounded-lg focus:ring-2 focus:ring-[--ring] focus:outline-none transition text-[--foreground]"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[--muted-foreground] mb-1">Data</label>
                    <input
                      type="date"
                      required
                      className="w-full p-3 bg-[--background] border border-[--input] rounded-lg focus:ring-2 focus:ring-[--ring] focus:outline-none transition text-[--foreground]"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[--muted-foreground] mb-1">Categoria</label>
                  <select
                    className="w-full p-3 bg-[--background] border border-[--input] rounded-lg focus:ring-2 focus:ring-[--ring] focus:outline-none transition text-[--foreground]"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  >
                    <option>Geral</option>
                    <option>Alimentação</option>
                    <option>Transporte</option>
                    <option>Moradia</option>
                    <option>Lazer</option>
                    <option>Investimento</option>
                    <option>Salário</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[--primary] text-[--primary-foreground] font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition shadow-lg mt-2"
                >
                  Salvar Lançamento
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function SummaryCard({ title, value, icon, valueColor }) {
  return (
    <div className="bg-[--card] p-6 rounded-[--radius] shadow-sm border border-[--border] flex items-start justify-between hover:shadow-md transition">
      <div>
        <p className="text-[--muted-foreground] text-sm font-medium mb-1">{title}</p>
        <h2 className={`text-2xl font-bold ${valueColor}`}>{formatCurrency(value)}</h2>
      </div>
      <div className="p-3 rounded-xl bg-[--muted]/50 border border-[--border]">
        {icon}
      </div>
    </div>
  );
}

function TransactionRow({ transaction, onDelete, compact = false }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl hover:bg-[--muted]/30 transition border border-transparent hover:border-[--border] ${compact ? 'py-2' : ''}`}>
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className={`p-2 rounded-lg shrink-0 border border-[--border] ${transaction.type === 'income' ? 'bg-[--background] text-[--chart-2]' : 'bg-[--background] text-[--chart-5]'}`}>
          {transaction.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[--foreground] truncate">{transaction.description}</p>
          <p className="text-xs text-[--muted-foreground]">{formatDate(transaction.date)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 shrink-0 ml-2">
        <span className={`text-sm font-bold ${transaction.type === 'income' ? 'text-[--chart-2]' : 'text-[--chart-5]'}`}>
          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
        </span>
        {!compact && (
          <button onClick={() => onDelete(transaction.id)} className="text-[--muted-foreground] hover:text-[--destructive]">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
        ? 'bg-[--sidebar-primary] text-[--sidebar-primary-foreground] shadow-md'
        : 'text-[--muted-foreground] hover:bg-[--sidebar-accent] hover:text-[--sidebar-accent-foreground]'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 w-16 ${active ? 'text-[--primary]' : 'text-[--muted-foreground]'}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
