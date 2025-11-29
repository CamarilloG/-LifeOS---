
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input, Modal } from '../components/ui/Common';

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  note: string;
  score: number; // 1-5 for heatmap
}

const MOODS = [
  { icon: '😄', label: '开心', color: 'bg-green-100 text-green-600', score: 5, heatColor: 'bg-green-500' },
  { icon: '🙂', label: '平静', color: 'bg-blue-100 text-blue-600', score: 4, heatColor: 'bg-blue-400' },
  { icon: '😐', label: '一般', color: 'bg-gray-100 text-gray-600', score: 3, heatColor: 'bg-gray-400' },
  { icon: '😔', label: '低落', color: 'bg-indigo-100 text-indigo-600', score: 2, heatColor: 'bg-indigo-400' },
  { icon: '😡', label: '生气', color: 'bg-red-100 text-red-600', score: 1, heatColor: 'bg-red-500' },
];

const MoodApp: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<MoodEntry[]>('mood-entries', []);
  const [selectedMood, setSelectedMood] = useState(MOODS[1]);
  const [note, setNote] = useState('');

  const addEntry = () => {
    setEntries(prev => [{
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood.icon,
      score: selectedMood.score,
      note
    }, ...prev]);
    setNote('');
  };

  // Heatmap Logic (Current Month)
  const heatmapData = useMemo(() => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const map = new Array(daysInMonth).fill(null);

    entries.forEach(entry => {
        const d = new Date(entry.date);
        if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
            map[d.getDate() - 1] = entry; // Simple: last entry of day wins
        }
    });
    return map;
  }, [entries]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="text-center py-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">您今天感觉如何？</h2>
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {MOODS.map(m => (
            <button
              key={m.label}
              onClick={() => setSelectedMood(m)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                selectedMood.label === m.label 
                ? 'ring-4 ring-primary/20 bg-white dark:bg-slate-700 shadow-xl scale-110' 
                : 'hover:bg-gray-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0'
              }`}
            >
              <span className="text-5xl drop-shadow-sm">{m.icon}</span>
              <span className="text-xs font-bold text-gray-500">{m.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3 max-w-md mx-auto">
          <Input 
            value={note} 
            onChange={e => setNote(e.target.value)} 
            placeholder="写一句简短的话记录当下..." 
            className="shadow-inner"
          />
          <Button onClick={addEntry} disabled={!note} className="shadow-lg shadow-primary/30">记录</Button>
        </div>
      </Card>

      {/* Heatmap Section */}
      <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-200">本月心情分布</h3>
            <span className="text-xs text-gray-400">{new Date().toLocaleString('zh-CN', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-center text-xs text-gray-300 mb-2">{d}</div>
            ))}
            {/* Offset for start of month could be added here, simplified for now */}
            {heatmapData.map((entry, idx) => {
                const moodConfig = entry ? MOODS.find(m => m.score === entry.score) : null;
                return (
                    <div 
                        key={idx} 
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all relative group ${
                            moodConfig ? moodConfig.heatColor : 'bg-gray-100 dark:bg-slate-800'
                        } ${moodConfig ? 'text-white font-bold shadow-sm' : 'text-gray-300'}`}
                    >
                        {idx + 1}
                        {entry && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs p-2 rounded w-32 hidden group-hover:block z-10 pointer-events-none">
                                <div className="text-lg text-center mb-1">{entry.mood}</div>
                                <p className="text-center opacity-80">{entry.note}</p>
                                <p className="text-center text-[10px] mt-1 opacity-50">{new Date(entry.date).toLocaleTimeString()}</p>
                            </div>
                        )}
                    </div>
                );
            })}
          </div>
      </Card>

      {/* Recent List */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 dark:text-gray-300 ml-1">最近动态</h3>
        {entries.slice(0, 5).map(entry => (
          <div key={entry.id} className="flex gap-4 items-center p-4 bg-white dark:bg-paper rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:translate-x-1 transition-transform">
             <div className="text-4xl bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl shadow-inner">{entry.mood}</div>
             <div className="flex-1">
                <div className="flex justify-between items-start">
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{entry.note}</p>
                    <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleString('zh-CN', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodApp;
