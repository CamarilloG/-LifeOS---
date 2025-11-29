
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input, Modal, Badge } from '../components/ui/Common';

interface Expense {
  id: string;
  title: string;
  amount: number;
  payer: string;
}

const SplitApp: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('split-expenses', []);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [showSettlement, setShowSettlement] = useState(false);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !payer) return;
    setExpenses(prev => [...prev, {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      payer
    }]);
    setTitle('');
    setAmount('');
  };

  const members = useMemo(() => Array.from(new Set(expenses.map(e => e.payer))), [expenses]);
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Advanced Debt Simplification Algorithm
  const settlementPlan = useMemo(() => {
    if (members.length === 0) return [];
    
    // 1. Calculate Balances
    const balances: Record<string, number> = {};
    members.forEach(m => balances[m] = 0);
    
    const splitAmount = total / members.length;
    
    expenses.forEach(e => {
        balances[e.payer] += e.amount;
    });

    // Subtract fair share
    members.forEach(m => balances[m] -= splitAmount);

    // 2. Separate into Debtors and Creditors
    let debtors = members.filter(m => balances[m] < -0.01).map(m => ({ name: m, amount: balances[m] }));
    let creditors = members.filter(m => balances[m] > 0.01).map(m => ({ name: m, amount: balances[m] }));
    
    // Sort to optimize matching
    debtors.sort((a, b) => a.amount - b.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const transfers = [];
    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        
        // The amount to transfer is the minimum of what debtor owes and creditor is owed
        const amount = Math.min(Math.abs(debtor.amount), creditor.amount);
        
        transfers.push({ from: debtor.name, to: creditor.name, amount });
        
        debtor.amount += amount;
        creditor.amount -= amount;

        if (Math.abs(debtor.amount) < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return transfers;
  }, [expenses, members, total]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-pink-100 font-medium mb-1">总支出</h2>
            <p className="text-5xl font-bold tracking-tight">¥{total.toFixed(2)}</p>
            <div className="mt-6 flex items-center gap-2 text-pink-100">
                <i className="fas fa-users"></i>
                <span>{members.length} 人参与</span>
                <span className="mx-2">•</span>
                <span>人均 ¥{(total / (members.length || 1)).toFixed(2)}</span>
            </div>
          </div>
          <i className="fas fa-receipt absolute -bottom-4 -right-4 text-9xl text-white opacity-10"></i>
        </Card>

        <Card>
          <h3 className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <i className="fas fa-pen-to-square text-pink-500"></i> 记一笔
          </h3>
          <form onSubmit={addExpense} className="space-y-3">
            <Input placeholder="消费项目 (如: 聚餐、KTV)" value={title} onChange={e => setTitle(e.target.value)} required />
            <div className="flex gap-2">
              <div className="relative flex-1">
                 <span className="absolute left-3 top-2 text-gray-400">¥</span>
                 <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required className="pl-6" />
              </div>
              <Input placeholder="付款人" value={payer} onChange={e => setPayer(e.target.value)} required className="flex-1" list="payers" />
              <datalist id="payers">
                  {members.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>
            <Button type="submit" variant="secondary" className="w-full">添加</Button>
          </form>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-xl">
             账单明细 
             <span className="ml-2 text-sm font-normal text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">{expenses.length}</span>
        </h3>
        <div className="flex gap-3">
            <Button variant="outline" onClick={() => setExpenses([])} className="text-red-500 border-red-200 hover:bg-red-50">清空</Button>
            <Button onClick={() => setShowSettlement(true)} className="bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/20">
                <i className="fas fa-calculator mr-2"></i> 结算方案
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {expenses.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <i className="fas fa-file-invoice-dollar text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-400">暂无支出记录，快去添加吧</p>
            </div>
          )}
          {expenses.map((ex, idx) => (
            <div key={ex.id} className="bg-white dark:bg-paper p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-500 flex items-center justify-center font-bold">
                    {ex.payer[0].toUpperCase()}
                </div>
                <div>
                    <p className="font-bold text-gray-900 dark:text-white">{ex.title}</p>
                    <p className="text-xs text-gray-500">由 {ex.payer} 支付</p>
                </div>
              </div>
              <Badge color="pink">¥{ex.amount.toFixed(2)}</Badge>
            </div>
          ))}
      </div>

      {/* Settlement Modal */}
      <Modal isOpen={showSettlement} onClose={() => setShowSettlement(false)} title="最优结算方案">
        <div className="space-y-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">需要转账总额</p>
                <p className="text-3xl font-bold text-pink-600">¥{settlementPlan.reduce((a,c) => a+c.amount, 0).toFixed(2)}</p>
            </div>

            <div className="space-y-4">
                {settlementPlan.length === 0 ? (
                    <p className="text-center text-gray-500">无需转账，大家已经付得很均匀了！</p>
                ) : (
                    settlementPlan.map((transfer, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-red-500">{transfer.from}</span>
                                <i className="fas fa-arrow-right text-gray-300 text-sm"></i>
                                <span className="font-bold text-green-500">{transfer.to}</span>
                            </div>
                            <span className="font-mono font-bold">¥{transfer.amount.toFixed(2)}</span>
                        </div>
                    ))
                )}
            </div>
            
            <p className="text-xs text-gray-400 text-center">
                *此方案通过最小化转账次数算法计算得出
            </p>
        </div>
      </Modal>
    </div>
  );
};

export default SplitApp;
