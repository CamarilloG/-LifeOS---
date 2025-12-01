
import React, { useMemo, useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input, Modal, ProgressBar, Badge } from '../components/ui/Common';
import { Transaction, Budget } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const CATEGORIES = ['餐饮', '交通', '居住', '娱乐', '医疗', '购物', '工资', '理财', '其他'];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#8b5cf6', '#3b82f6', '#14b8a6', '#94a3b8'];

const SAMPLE_TRANSACTIONS: Transaction[] = [
    { id: 't1', amount: 15000, type: 'income', category: '工资', date: new Date().toISOString(), note: '11月薪资' },
    { id: 't2', amount: 3500, type: 'expense', category: '居住', date: new Date().toISOString(), note: '房租' },
    { id: 't3', amount: 58, type: 'expense', category: '餐饮', date: new Date().toISOString(), note: '麦当劳' },
    { id: 't4', amount: 420, type: 'expense', category: '购物', date: new Date().toISOString(), note: '优衣库' },
    { id: 't5', amount: 200, type: 'income', category: '理财', date: new Date().toISOString(), note: '基金收益' },
    { id: 't6', amount: 35, type: 'expense', category: '交通', date: new Date().toISOString(), note: '打车' },
    { id: 't7', amount: 1280, type: 'expense', category: '娱乐', date: new Date().toISOString(), note: '周末聚会' },
];

const FinanceApp: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('finance-logs', []);
  const [budget, setBudget] = useLocalStorage<Budget>('finance-budget', { limit: 5000, warningThreshold: 80 });
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      category,
      note,
      date: new Date().toISOString()
    };
    
    setTransactions(prev => [newTx, ...prev]);
    setAmount('');
    setNote('');
  };

  const loadSamples = () => {
      setTransactions(SAMPLE_TRANSACTIONS);
  };

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const budgetProgress = (stats.expense / budget.limit) * 100;
  const isOverBudget = stats.expense > budget.limit;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Left Column: Input & Overview */}
      <div className="xl:col-span-1 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fas fa-wallet text-9xl"></i>
          </div>
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-medium mb-1 flex items-center gap-2">
                总资产净值 
                {stats.balance >= 0 ? <i className="fas fa-arrow-trend-up text-green-300"></i> : <i className="fas fa-arrow-trend-down text-red-300"></i>}
            </p>
            <h2 className="text-4xl font-bold mb-6">¥{stats.balance.toFixed(2)}</h2>
            <div className="grid grid-cols-2 gap-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div>
                    <p className="text-xs text-indigo-100 opacity-70">本月收入</p>
                    <p className="text-lg font-semibold text-green-300">+¥{stats.income}</p>
                </div>
                <div>
                    <p className="text-xs text-indigo-100 opacity-70">本月支出</p>
                    <p className="text-lg font-semibold text-red-300">-¥{stats.expense}</p>
                </div>
            </div>
          </div>
        </Card>

        {/* Budget Card */}
        <Card>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700 dark:text-gray-200">本月预算</h3>
                <button onClick={() => setShowBudgetModal(true)} className="text-xs text-primary hover:underline">设置</button>
            </div>
            <div className="flex justify-between text-sm mb-2 text-gray-500">
                <span>已用: ¥{stats.expense}</span>
                <span>预算: ¥{budget.limit}</span>
            </div>
            <ProgressBar progress={budgetProgress} color={isOverBudget ? 'bg-red-500' : (budgetProgress > budget.warningThreshold ? 'bg-orange-500' : 'bg-green-500')} />
            <p className="text-xs text-gray-400 mt-2 text-right">
                {isOverBudget ? `超支 ¥${(stats.expense - budget.limit).toFixed(0)}` : `剩余 ¥${(budget.limit - stats.expense).toFixed(0)}`}
            </p>
        </Card>

        {/* Add Transaction Form */}
        <Card>
          <h3 className="font-bold text-lg mb-4">记一笔</h3>
          <form onSubmit={addTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t as any)}
                  className={`py-2 rounded-lg text-sm font-bold transition-all ${
                    type === t 
                    ? (t === 'expense' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300') 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
                  }`}
                >
                  {t === 'expense' ? '支出' : '收入'}
                </button>
              ))}
            </div>

            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">¥</span>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  step="0.01"
                  className="pl-8 text-lg font-mono"
                  required
                />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.slice(0, 5).map(c => (
                    <button type="button" key={c} onClick={() => setCategory(c)} className={`text-xs py-1.5 rounded border ${category === c ? 'border-primary text-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>{c}</button>
                ))}
                 <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="col-span-1 text-xs px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-gray-500"
                >
                  {CATEGORIES.slice(5).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <Input 
              placeholder="备注..." 
              value={note} 
              onChange={e => setNote(e.target.value)} 
            />

            <Button type="submit" className="w-full" size="lg" variant={type === 'expense' ? 'danger' : 'secondary'}>
              确认
            </Button>
          </form>
        </Card>
      </div>

      {/* Right Column: Charts & List */}
      <div className="xl:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Bar Chart */}
            <Card className="h-72 flex flex-col">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">支出排行</h3>
                {expenseByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseByCategory.slice(0, 5)} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12}} stroke="#888" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 8 }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {expenseByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                ) : <div className="flex-1 flex items-center justify-center text-gray-400">暂无数据</div>}
            </Card>

            {/* Pie Chart */}
            <Card className="h-72 flex flex-col">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">支出占比</h3>
                {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={expenseByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {expenseByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 8 }} />
                    </PieChart>
                </ResponsiveContainer>
                ) : <div className="flex-1 flex items-center justify-center text-gray-400">暂无数据</div>}
            </Card>
        </div>

        {/* Transaction List */}
        <div className="bg-white dark:bg-paper rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
             <h3 className="font-bold text-gray-700 dark:text-gray-200">账单明细</h3>
             {transactions.length > 0 && <span className="text-xs text-gray-400">{transactions.length} 笔记录</span>}
           </div>
           <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto custom-scrollbar">
             {transactions.length === 0 && (
                <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                    <i className="fas fa-file-invoice text-4xl mb-3 opacity-30"></i>
                    <p className="mb-2">暂无记录。</p>
                    <button onClick={loadSamples} className="text-primary hover:underline text-sm font-medium">
                        加载演示数据
                    </button>
                </div>
             )}
             {transactions.map(t => (
               <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                     t.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                   }`}>
                     <i className={`fas ${t.type === 'income' ? 'fa-arrow-down' : 'fa-shopping-bag'}`}></i>
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 dark:text-gray-100">{t.category}</p>
                        <span className="text-xs text-gray-400 font-mono">{t.date.split('T')[0]}</span>
                     </div>
                     <p className="text-xs text-gray-500">{t.note || '无备注'}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className={`font-bold font-mono ${t.type === 'income' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                        {t.type === 'income' ? '+' : '-'} {t.amount.toFixed(2)}
                    </p>
                    <button onClick={() => setTransactions(prev => prev.filter(x => x.id !== t.id))} className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        删除
                    </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <Modal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} title="设置月度预算">
        <div className="space-y-4">
            <div>
                <label className="block text-sm text-gray-500 mb-1">预算金额 (¥)</label>
                <Input type="number" value={budget.limit} onChange={e => setBudget({...budget, limit: parseFloat(e.target.value)})} />
            </div>
            <div>
                <label className="block text-sm text-gray-500 mb-1">预警阈值 (%)</label>
                <Input type="number" value={budget.warningThreshold} onChange={e => setBudget({...budget, warningThreshold: parseFloat(e.target.value)})} />
                <p className="text-xs text-gray-400 mt-1">当支出超过此百分比时，进度条变色警告。</p>
            </div>
            <Button onClick={() => setShowBudgetModal(false)} className="w-full">保存设置</Button>
        </div>
      </Modal>
    </div>
  );
};

export default FinanceApp;
