
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input, Modal, Badge } from '../components/ui/Common';
import { Task, PomoSession, PomoSettings } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// 音频资源链接
const AUDIO_ASSETS = {
  alarm: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  rain: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy_loud.ogg',
  forest: 'https://actions.google.com/sounds/v1/ambiences/outdoors.ogg',
  cafe: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
};

const DEFAULT_SETTINGS: PomoSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStart: false,
  soundEnabled: true,
  ambientSound: 'none',
  notificationEnabled: false,
};

const MODES = {
  FOCUS: { id: 'FOCUS', label: '专注', color: 'text-primary', stroke: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  SHORT: { id: 'SHORT', label: '短休', color: 'text-emerald-500', stroke: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  LONG: { id: 'LONG', label: '长休', color: 'text-blue-500', stroke: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

const PomodoroApp: React.FC = () => {
  // Data State
  const [tasks, setTasks] = useLocalStorage<Task[]>('pomo-tasks', []);
  const [history, setHistory] = useLocalStorage<PomoSession[]>('pomo-history', []);
  const [settings, setSettings] = useLocalStorage<PomoSettings>('pomo-settings', DEFAULT_SETTINGS);

  // Timer State
  const [mode, setMode] = useState<keyof typeof MODES>('FOCUS');
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // UI State
  const [newTask, setNewTask] = useState('');
  const [newTaskEstimate, setNewTaskEstimate] = useState(1);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for Audio
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Logic & Effects ---

  // 1. Update Document Title
  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const timeString = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    document.title = isRunning ? `(${timeString}) 专注时钟 - LifeOS` : '专注时钟 - LifeOS';
    
    return () => { document.title = 'LifeOS - 生活助手'; };
  }, [timeLeft, isRunning]);

  // 2. Handle Settings Change (Reset timer if settings change)
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'FOCUS') setTimeLeft(settings.focusTime * 60);
      if (mode === 'SHORT') setTimeLeft(settings.shortBreakTime * 60);
      if (mode === 'LONG') setTimeLeft(settings.longBreakTime * 60);
    }
  }, [settings.focusTime, settings.shortBreakTime, settings.longBreakTime, mode, isRunning]);

  // 3. Ambient Sound Control
  useEffect(() => {
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio();
      ambientAudioRef.current.loop = true;
    }

    if (isRunning && settings.ambientSound !== 'none') {
      ambientAudioRef.current.src = AUDIO_ASSETS[settings.ambientSound];
      ambientAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else {
      ambientAudioRef.current.pause();
    }
  }, [isRunning, settings.ambientSound]);

  // 4. Request Notification Permission
  const requestNotification = () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  // 5. Timer Logic
  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Sound
    if (settings.soundEnabled) {
      if (!alarmAudioRef.current) alarmAudioRef.current = new Audio(AUDIO_ASSETS.alarm);
      alarmAudioRef.current.play().catch(e => console.log("Alarm failed", e));
    }

    // Notification
    if (settings.notificationEnabled && Notification.permission === "granted") {
      new Notification("专注时钟", { body: `${MODES[mode].label} 结束了！` });
    }

    // Logic
    if (mode === 'FOCUS') {
      const today = new Date().toISOString().split('T')[0];
      setHistory(prev => [...prev, { date: today, minutes: settings.focusTime }]);
      
      // Update Active Task
      if (activeTaskId) {
        setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, pomodoros: t.pomodoros + 1 } : t));
      }
      
      if (settings.autoStart) {
        setMode('SHORT');
        setTimeLeft(settings.shortBreakTime * 60);
        setIsRunning(true);
      }
    } else {
       // Break is over
       if (settings.autoStart) {
         setMode('FOCUS');
         setTimeLeft(settings.focusTime * 60);
         setIsRunning(true);
       }
    }
  };

  const toggleTimer = () => {
    if (!isRunning && settings.notificationEnabled) requestNotification();
    setIsRunning(!isRunning);
  };
  
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (mode === 'FOCUS') setTimeLeft(settings.focusTime * 60);
    else if (mode === 'SHORT') setTimeLeft(settings.shortBreakTime * 60);
    else setTimeLeft(settings.longBreakTime * 60);
  }, [mode, settings]);

  // --- Task Management ---

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { 
      id: Date.now().toString(), 
      title: newTask, 
      completed: false, 
      pomodoros: 0,
      estimated: newTaskEstimate
    }]);
    setNewTask('');
    setNewTaskEstimate(1);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (activeTaskId === id) setActiveTaskId(null);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // --- Visualization Logic ---
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Stats Data
  const statsData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayData = history.filter(h => h.date === date);
      const minutes = dayData.reduce((acc, curr) => acc + curr.minutes, 0);
      return { date: date.slice(5), minutes };
    });
  }, [history]);

  // Circular Progress
  const maxTime = mode === 'FOCUS' ? settings.focusTime * 60 : (mode === 'SHORT' ? settings.shortBreakTime * 60 : settings.longBreakTime * 60);
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / maxTime;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className={`transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-dark p-8 overflow-y-auto' : 'max-w-4xl mx-auto'}`}>
      
      {isFullscreen && (
        <button 
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
        >
          <i className="fas fa-compress text-gray-600 dark:text-gray-300"></i>
        </button>
      )}

      <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-1 max-w-2xl mx-auto' : 'lg:grid-cols-2'} gap-8`}>
        {/* Left: Timer Panel */}
        <div className="space-y-6 flex flex-col items-center justify-center min-h-[400px]">
          {/* Mode Switcher */}
          <div className="flex bg-white dark:bg-paper p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setIsRunning(false); }}
                className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  mode === m ? 'bg-white dark:bg-slate-700 shadow-md transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                } ${mode === m ? MODES[m].color : ''}`}
              >
                {MODES[m].label}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative group cursor-pointer" onClick={toggleTimer}>
             {/* Background Pulse Animation when running */}
             {isRunning && (
               <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${mode === 'FOCUS' ? 'bg-primary' : 'bg-emerald-500'}`}></div>
             )}
             
             <svg className="w-72 h-72 sm:w-80 sm:h-80 transform -rotate-90 drop-shadow-2xl">
                <circle 
                  cx="50%" cy="50%" r={radius} 
                  stroke="currentColor" strokeWidth="8" fill="transparent" 
                  className="text-gray-100 dark:text-slate-800" 
                />
                <circle 
                  cx="50%" cy="50%" r={radius} 
                  stroke={MODES[mode].stroke} strokeWidth="8" fill="transparent" 
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
             </svg>
             
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className={`text-6xl sm:text-7xl font-bold font-mono tracking-tighter ${MODES[mode].color} drop-shadow-sm select-none`}>
                 {formatTime(timeLeft)}
               </span>
               <div className="flex items-center gap-2 mt-4 text-gray-400 font-medium text-sm">
                  {isRunning ? <i className="fas fa-play text-xs animate-pulse"></i> : <i className="fas fa-pause text-xs"></i>}
                  <span className="uppercase tracking-widest">{MODES[mode].label}中</span>
               </div>
               {activeTaskId && mode === 'FOCUS' && (
                  <div className="absolute bottom-16 px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-xs text-indigo-600 dark:text-indigo-300 max-w-[180px] truncate animate-fade-in">
                    <i className="fas fa-thumbtack mr-1"></i> {tasks.find(t=>t.id===activeTaskId)?.title}
                  </div>
               )}
             </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 w-full max-w-xs justify-center items-center">
             <Button 
                onClick={toggleTimer} 
                size="lg" 
                className={`w-36 h-12 rounded-2xl shadow-lg transform transition-transform active:scale-95 ${isRunning ? 'bg-orange-500 hover:bg-orange-600 ring-4 ring-orange-500/20' : 'bg-primary ring-4 ring-primary/20'}`}
             >
                <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'} mr-2`}></i>
                {isRunning ? '暂停' : '开始'}
             </Button>
             
             <Button variant="ghost" onClick={resetTimer} className="rounded-2xl w-12 h-12 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700" title="重置">
               <i className="fas fa-rotate-right"></i>
             </Button>
             
             <Button variant="ghost" onClick={() => setShowSettings(true)} className="rounded-2xl w-12 h-12 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700" title="设置">
               <i className="fas fa-sliders"></i>
             </Button>

             <Button variant="ghost" onClick={() => setIsFullscreen(!isFullscreen)} className="rounded-2xl w-12 h-12 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 hidden sm:flex" title="全屏沉浸">
               <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
             </Button>
          </div>
        </div>

        {/* Right: Task Panel (Hidden in fullscreen unless very large screen) */}
        {!isFullscreen && (
          <div className="space-y-4 h-full flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden bg-white/50 backdrop-blur border border-white/20 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <i className="fas fa-list-check text-primary"></i> 待办事项
                </h3>
                <button onClick={() => setShowStats(true)} className="text-xs text-primary hover:underline">
                  <i className="fas fa-chart-pie mr-1"></i> 查看统计
                </button>
              </div>
              
              <form onSubmit={addTask} className="mb-4 space-y-2">
                <div className="flex gap-2">
                    <Input 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    placeholder="添加一个新的专注目标..." 
                    className="flex-1 bg-white dark:bg-slate-900 shadow-sm"
                    />
                    <div className="relative w-20" title="预估番茄数">
                        <Input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={newTaskEstimate} 
                            onChange={e => setNewTaskEstimate(parseInt(e.target.value))} 
                            className="w-full text-center pl-6"
                        />
                        <i className="fas fa-stopwatch absolute left-3 top-3 text-gray-400 text-xs"></i>
                    </div>
                </div>
                <Button type="submit" disabled={!newTask} variant="primary" className="w-full shadow-none py-1.5 text-sm">
                  <i className="fas fa-plus mr-2"></i> 添加任务
                </Button>
              </form>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {tasks.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-slate-800/50">
                     <i className="fas fa-seedling text-2xl mb-2 text-green-400"></i>
                     <p className="text-sm">添加任务，开始种树</p>
                  </div>
                )}
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`group relative p-3 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                        activeTaskId === task.id 
                        ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800' 
                        : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <button 
                                onClick={() => toggleTask(task.id)}
                                className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                                task.completed ? 'bg-primary border-primary text-white' : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                }`}
                            >
                                {task.completed && <i className="fas fa-check text-xs"></i>}
                            </button>
                            <span className={`font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                {task.title}
                            </span>
                        </div>
                        <button 
                        onClick={() => deleteTask(task.id)} 
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                        >
                        <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs pl-8">
                        <div className="flex gap-1 text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                             <span title="已完成番茄" className={task.pomodoros > task.estimated ? 'text-orange-500 font-bold' : 'text-primary font-bold'}>{task.pomodoros}</span>
                             <span>/</span>
                             <span title="预估番茄">{task.estimated}</span>
                             <i className="fas fa-clock ml-1"></i>
                        </div>
                        
                        {!task.completed && (
                            <button 
                                onClick={() => setActiveTaskId(activeTaskId === task.id ? null : task.id)}
                                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                    activeTaskId === task.id 
                                    ? 'bg-indigo-500 text-white border-indigo-500' 
                                    : 'border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'
                                }`}
                            >
                                {activeTaskId === task.id ? '正在专注' : '设为当前'}
                            </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Stats Modal */}
      <Modal isOpen={showStats} onClose={() => setShowStats(false)} title="专注统计">
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-center">
               <p className="text-xs text-indigo-500 uppercase font-bold">总专注时长</p>
               <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{history.reduce((acc, curr) => acc + curr.minutes, 0)} <span className="text-sm font-normal">分钟</span></p>
             </div>
             <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl text-center">
               <p className="text-xs text-emerald-500 uppercase font-bold">今日专注</p>
               <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                 {statsData[statsData.length-1]?.minutes || 0} <span className="text-sm font-normal">分钟</span>
               </p>
             </div>
           </div>
           
           <div className="h-64 w-full">
             <h4 className="text-sm font-bold text-gray-500 mb-4">近7天趋势</h4>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={statsData}>
                 <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                   cursor={{fill: 'transparent'}}
                 />
                 <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="时钟设置">
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3 border-l-4 border-primary pl-2">时长设置 (分钟)</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">专注</label>
                        <Input type="number" value={settings.focusTime} onChange={e => setSettings({...settings, focusTime: parseInt(e.target.value) || 25})} />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">短休</label>
                        <Input type="number" value={settings.shortBreakTime} onChange={e => setSettings({...settings, shortBreakTime: parseInt(e.target.value) || 5})} />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">长休</label>
                        <Input type="number" value={settings.longBreakTime} onChange={e => setSettings({...settings, longBreakTime: parseInt(e.target.value) || 15})} />
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3 border-l-4 border-emerald-500 pl-2">声音与通知</h4>
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium">启用结束提示音</span>
                        <input type="checkbox" checked={settings.soundEnabled} onChange={e => setSettings({...settings, soundEnabled: e.target.checked})} className="w-5 h-5 text-primary rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium">自动开始下个计时</span>
                        <input type="checkbox" checked={settings.autoStart} onChange={e => setSettings({...settings, autoStart: e.target.checked})} className="w-5 h-5 text-primary rounded" />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium">桌面通知</span>
                        <input type="checkbox" checked={settings.notificationEnabled} onChange={e => {setSettings({...settings, notificationEnabled: e.target.checked}); if(e.target.checked) requestNotification(); }} className="w-5 h-5 text-primary rounded" />
                    </label>

                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <span className="text-sm font-medium block mb-2">背景白噪音</span>
                        <div className="grid grid-cols-4 gap-2">
                             {[
                                {id: 'none', icon: 'fa-volume-xmark', label: '无'},
                                {id: 'rain', icon: 'fa-cloud-rain', label: '雨声'},
                                {id: 'forest', icon: 'fa-tree', label: '森林'},
                                {id: 'cafe', icon: 'fa-mug-hot', label: '咖啡'},
                             ].map((s) => (
                                 <button
                                    key={s.id}
                                    onClick={() => setSettings({...settings, ambientSound: s.id as any})}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors ${
                                        settings.ambientSound === s.id 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                                    }`}
                                 >
                                     <i className={`fas ${s.icon} mb-1`}></i>
                                     {s.label}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            <Button onClick={() => setShowSettings(false)} className="w-full">保存设置</Button>
        </div>
      </Modal>
    </div>
  );
};

export default PomodoroApp;
