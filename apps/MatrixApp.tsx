import React, { useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Button, Input } from '../components/ui/Common';

interface MatrixTask {
  id: string;
  title: string;
  urgent: boolean;
  important: boolean;
}

const MatrixApp: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<MatrixTask[]>('matrix-tasks', []);
  const [newTask, setNewTask] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), title: newTask, urgent, important }]);
    setNewTask('');
    setUrgent(false);
    setImportant(false);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const Quadrant = ({ title, isUrgent, isImportant, colorClass, icon }: any) => {
    const qTasks = tasks.filter(t => t.urgent === isUrgent && t.important === isImportant);
    
    return (
      <div className={`flex flex-col h-full rounded-xl border ${colorClass} bg-white dark:bg-paper overflow-hidden`}>
        <div className={`p-3 font-bold text-sm uppercase tracking-wider flex items-center justify-between border-b ${colorClass} bg-opacity-10`}>
          <span>{title}</span>
          <i className={`fas ${icon}`}></i>
        </div>
        <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-[300px]">
          {qTasks.map(t => (
            <div key={t.id} className="flex justify-between items-start group bg-gray-50 dark:bg-slate-800 p-2 rounded text-sm">
              <span className="text-gray-800 dark:text-gray-200">{t.title}</span>
              <button onClick={() => removeTask(t.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}
          {qTasks.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">无任务</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 bg-white dark:bg-paper p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4 items-center">
          <Input 
            value={newTask} 
            onChange={e => setNewTask(e.target.value)} 
            placeholder="添加新任务..." 
            className="flex-1"
          />
          <div className="flex gap-4">
             <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="w-4 h-4 text-primary rounded" />
                <span className="text-sm font-medium">紧急</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <input type="checkbox" checked={important} onChange={e => setImportant(e.target.checked)} className="w-4 h-4 text-primary rounded" />
                <span className="text-sm font-medium">重要</span>
             </label>
          </div>
          <Button type="submit" disabled={!newTask} className="w-full md:w-auto">添加</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        <Quadrant 
          title="紧急且重要 (马上做)" 
          isUrgent={true} isImportant={true} 
          colorClass="border-red-200 text-red-600 bg-red-50 dark:bg-red-900/10" 
          icon="fa-fire"
        />
        <Quadrant 
          title="重要不紧急 (计划做)" 
          isUrgent={false} isImportant={true} 
          colorClass="border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/10" 
          icon="fa-calendar-check"
        />
        <Quadrant 
          title="紧急不重要 (授权做)" 
          isUrgent={true} isImportant={false} 
          colorClass="border-orange-200 text-orange-600 bg-orange-50 dark:bg-orange-900/10" 
          icon="fa-user-clock"
        />
        <Quadrant 
          title="不紧急不重要 (不做)" 
          isUrgent={false} isImportant={false} 
          colorClass="border-gray-200 text-gray-500 bg-gray-50 dark:bg-gray-800" 
          icon="fa-trash"
        />
      </div>
    </div>
  );
};

export default MatrixApp;