
import React, { useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input } from '../components/ui/Common';
import { MediaItem } from '../types';

const SAMPLE_MEDIA: MediaItem[] = [
  { id: '1', title: '三体 (全集)', type: 'book', rating: 0, status: 'todo' },
  { id: '2', title: '星际穿越', type: 'movie', rating: 5, status: 'done', review: '硬科幻的巅峰之作，爱是穿越时空的唯一变量。' },
  { id: '3', title: '肖申克的救赎', type: 'movie', rating: 5, status: 'done', review: '希望是美好的东西，也许是世上最美好的东西。' },
  { id: '4', title: '活着', type: 'book', rating: 5, status: 'done', review: '人是为了活着本身而活着，而不是为了活着之外的任何事物所活着。' },
  { id: '5', title: '原子习惯', type: 'book', rating: 0, status: 'todo' },
];

const MediaApp: React.FC = () => {
  const [items, setItems] = useLocalStorage<MediaItem[]>('media-list', SAMPLE_MEDIA);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'book' | 'movie'>('book');
  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
  
  // Review Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState('');

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

  const startEditingReview = (item: MediaItem) => {
    setEditingId(item.id);
    setEditReviewText(item.review || '');
  };

  const saveReview = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, review: editReviewText } : i));
    setEditingId(null);
    setEditReviewText('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Input Area */}
      <Card className="border-l-4 border-l-red-400">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle text-red-400"></i> 添加新条目
        </h3>
        <form onSubmit={addItem} className="flex flex-col sm:flex-row gap-3">
          <select 
            value={type} 
            onChange={e => setType(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="book">📚 书籍</option>
            <option value="movie">🎬 影视</option>
          </select>
          <Input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="书名 / 电影名..." 
            className="flex-1" 
          />
          <Button type="submit" className="bg-red-400 hover:bg-red-500 shadow-lg shadow-red-400/20 text-white border-none">添加</Button>
        </form>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('todo')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'todo' 
            ? 'border-red-400 text-red-500' 
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          待看清单 ({items.filter(i => i.status === 'todo').length})
        </button>
        <button 
          onClick={() => setActiveTab('done')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'done' 
            ? 'border-red-400 text-red-500' 
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          已看/已读 ({items.filter(i => i.status === 'done').length})
        </button>
      </div>

      {/* Lists */}
      <div className="space-y-4 min-h-[300px]">
        {/* Todo List View */}
        {activeTab === 'todo' && (
          <div className="animate-fade-in space-y-3">
            {items.filter(i => i.status === 'todo').map(item => (
              <div key={item.id} className="bg-white dark:bg-paper p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    item.type === 'book' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'
                  }`}>
                    <i className={`fas ${item.type === 'book' ? 'fa-book' : 'fa-film'}`}></i>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{item.title}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(item.id)} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-green-50 hover:text-green-500 hover:border-green-500 transition-all flex items-center justify-center" title="标记为完成">
                    <i className="fas fa-check"></i>
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            {items.filter(i => i.status === 'todo').length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <i className="fas fa-clipboard-list text-4xl mb-3 opacity-30"></i>
                <p>清单空空如也，去添加一些好书好剧吧！</p>
              </div>
            )}
          </div>
        )}

        {/* Done List View */}
        {activeTab === 'done' && (
          <div className="animate-fade-in space-y-4">
            {items.filter(i => i.status === 'done').map(item => (
              <div key={item.id} className="bg-white dark:bg-paper p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-xs"></i>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{item.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${item.type === 'book' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                        {item.type === 'book' ? '书' : '影'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => toggleStatus(item.id)} className="text-gray-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="放回待看">
                        <i className="fas fa-undo"></i>
                     </button>
                     <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <i className="fas fa-trash"></i>
                     </button>
                  </div>
                </div>

                {/* Rating & Review Section */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                            <button 
                                key={star} 
                                onClick={() => setRating(item.id, star)}
                                className={`text-lg transition-transform hover:scale-110 ${star <= item.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            >
                                <i className="fas fa-star"></i>
                            </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => startEditingReview(item)} 
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                        >
                            <i className="fas fa-pen"></i> {item.review ? '修改评价' : '写评价'}
                        </button>
                    </div>

                    {editingId === item.id ? (
                        <div className="animate-fade-in">
                            <textarea
                                value={editReviewText}
                                onChange={(e) => setEditReviewText(e.target.value)}
                                className="w-full p-2 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-red-400 focus:outline-none mb-2"
                                rows={2}
                                placeholder="写下你的简短书评/影评..."
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-700">取消</button>
                                <button onClick={() => saveReview(item.id)} className="text-xs bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500">保存</button>
                            </div>
                        </div>
                    ) : (
                        item.review && (
                            <div className="text-sm text-gray-600 dark:text-gray-300 italic pl-2 border-l-2 border-red-200 dark:border-red-900/30">
                                "{item.review}"
                            </div>
                        )
                    )}
                </div>
              </div>
            ))}
            {items.filter(i => i.status === 'done').length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>您还没有完成任何阅读或观影记录。</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaApp;
