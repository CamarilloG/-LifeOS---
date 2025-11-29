import React, { useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input } from '../components/ui/Common';

interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
}

const GroceryApp: React.FC = () => {
  const [items, setItems] = useLocalStorage<GroceryItem[]>('grocery-list', []);
  const [input, setInput] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setItems(prev => [...prev, { id: Date.now().toString(), name: input, checked: false }]);
    setInput('');
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const clearChecked = () => setItems(prev => prev.filter(i => !i.checked));

  return (
    <div className="max-w-xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <Card className="mb-4">
        <form onSubmit={addItem} className="flex gap-2">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="需要买什么？(如: 牛奶, 苹果)" 
            autoFocus
          />
          <Button type="submit"><i className="fas fa-plus"></i></Button>
        </form>
      </Card>

      <div className="bg-white dark:bg-paper rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">购物清单 ({items.filter(i=>!i.checked).length})</span>
            {items.some(i => i.checked) && (
              <button onClick={clearChecked} className="text-xs text-red-500 hover:text-red-600 font-medium">
                清除已买
              </button>
            )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {items.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-gray-300">
               <i className="fas fa-basket-shopping text-4xl mb-2"></i>
               <p>清单已清空</p>
             </div>
          )}
          {items.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600'
              }`}>
                {item.checked && <i className="fas fa-check text-xs"></i>}
              </div>
              <span className={`flex-1 ${item.checked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroceryApp;