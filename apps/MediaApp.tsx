import React, { useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input } from '../components/ui/Common';

interface MediaItem {
  id: string;
  title: string;
  type: 'book' | 'movie';
  rating: number; // 0-5
  status: 'todo' | 'done';
}

const MediaApp: React.FC = () => {
  const [items, setItems] = useLocalStorage<MediaItem[]>('media-list', []);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'book' | 'movie'>('book');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setItems(prev => [{ id: Date.now().toString(), title, type, rating: 0, status: 'todo' }, ...prev]);
    setTitle('');
  };

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'todo' ? 'done' : 'todo' } : i));
  };

  const setRating = (id: string, rating: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, rating } : i));
  };

  const deleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <form onSubmit={addItem} className="flex gap-3">
          <select 
            value={type} 
            onChange={e => setType(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            <option value="book">书籍</option>
            <option value="movie">影视</option>
          </select>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="添加书名或电影名..." className="flex-1" />
          <Button type="submit">添加</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Todo List */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 dark:text-gray-300">待看清单</h3>
          {items.filter(i => i.status === 'todo').map(item => (
            <div key={item.id} className="bg-white dark:bg-paper p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group">
               <div className="flex items-center gap-3">
                 <i className={`fas ${item.type === 'book' ? 'fa-book text-blue-500' : 'fa-film text-purple-500'} w-6 text-center`}></i>
                 <span className="text-gray-800 dark:text-gray-200">{item.title}</span>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => toggleStatus(item.id)} className="text-green-500 hover:bg-green-50 p-1.5 rounded-full transition-colors" title="标记为完成">
                   <i className="fas fa-check"></i>
                 </button>
                 <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 p-1.5 transition-colors">
                   <i className="fas fa-trash"></i>
                 </button>
               </div>
            </div>
          ))}
          {items.filter(i => i.status === 'todo').length === 0 && <p className="text-gray-400 text-sm text-center py-4">清单空空如也。</p>}
        </div>

        {/* Done List */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 dark:text-gray-300">已读/已看</h3>
          {items.filter(i => i.status === 'done').map(item => (
            <div key={item.id} className="bg-white dark:bg-paper p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 opacity-80">
               <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(item.id)} className="text-gray-400 hover:text-green-500 text-xs" title="放回待看">
                        <i className="fas fa-undo"></i>
                    </button>
                    <span className="line-through text-gray-500">{item.title}</span>
                 </div>
                 <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 text-xs">
                   <i className="fas fa-times"></i>
                 </button>
               </div>
               <div className="flex gap-1 justify-end">
                 {[1, 2, 3, 4, 5].map(star => (
                   <button 
                     key={star} 
                     onClick={() => setRating(item.id, star)}
                     className={`text-sm ${star <= item.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'} hover:scale-110 transition-transform`}
                   >
                     <i className="fas fa-star"></i>
                   </button>
                 ))}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaApp;