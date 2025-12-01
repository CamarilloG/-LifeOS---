
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input, Modal, ProgressBar } from '../components/ui/Common';

const HealthApp: React.FC = () => {
  // Water State
  const [waterCount, setWaterCount] = useLocalStorage<number>('health-water', 0);
  const [waterGoal, setWaterGoal] = useLocalStorage<number>('health-water-goal', 8);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Stand State
  const [lastStand, setLastStand] = useLocalStorage<string | null>('health-stand', null);
  const [sittingMinutes, setSittingMinutes] = useState(0);

  // Breathing State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('点击开始');
  const [breathScale, setBreathScale] = useState(1);

  // --- Effects ---

  // Update sitting time every minute
  useEffect(() => {
    const updateTime = () => {
      if (lastStand) {
        const now = new Date();
        const last = new Date(lastStand);
        const diffMs = now.getTime() - last.getTime();
        setSittingMinutes(Math.floor(diffMs / 60000));
      } else {
        setSittingMinutes(0);
      }
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [lastStand]);

  // Breathing Animation Logic
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isBreathing) {
      let phase = 0; // 0: Inhale, 1: Hold, 2: Exhale
      
      const runCycle = () => {
        if (phase === 0) {
          setBreathText('吸气 (Inhale)');
          setBreathScale(1.5);
          phase = 1;
          // 吸气 4秒
          timeoutId = setTimeout(runCycle, 4000);
        } else if (phase === 1) {
          setBreathText('屏气 (Hold)');
          setBreathScale(1.5); // Keep expanded
          phase = 2;
          // 屏气 2秒 (简化版 4-7-8，这里用 4-2-4 循环演示更流畅)
          timeoutId = setTimeout(runCycle, 2000);
        } else {
          setBreathText('呼气 (Exhale)');
          setBreathScale(1.0);
          phase = 0;
          // 呼气 4秒
          timeoutId = setTimeout(runCycle, 4000);
        }
      };
      
      runCycle();
    } else {
      setBreathText('点击开始');
      setBreathScale(1);
    }
    
    // Cleanup: 必须清除定时器，否则停止后状态会继续更新
    return () => clearTimeout(timeoutId);
  }, [isBreathing]);

  // --- Handlers ---

  const addWater = () => setWaterCount(prev => prev + 1);
  const removeWater = () => setWaterCount(prev => Math.max(0, prev - 1));
  
  const recordStand = () => {
    setLastStand(new Date().toISOString());
    setSittingMinutes(0);
  };

  const toggleBreathing = () => setIsBreathing(!isBreathing);

  // --- Visual Helpers ---

  const waterPercentage = Math.min(100, (waterCount / waterGoal) * 100);
  
  // Stand Color Logic
  let standColor = 'text-gray-800 dark:text-white';
  let standStatus = '状态良好';
  let standBg = 'bg-green-50 dark:bg-green-900/20';
  
  if (!lastStand) {
      standColor = 'text-gray-400';
      standStatus = '未开始记录';
      standBg = 'bg-gray-50 dark:bg-slate-800';
  } else if (sittingMinutes > 60) {
      standColor = 'text-red-500 animate-pulse';
      standStatus = '久坐警告！';
      standBg = 'bg-red-50 dark:bg-red-900/20';
  } else if (sittingMinutes > 45) {
      standColor = 'text-orange-500';
      standStatus = '该起来走走了';
      standBg = 'bg-orange-50 dark:bg-orange-900/20';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Water Tracker */}
        <Card className="flex flex-col justify-between relative overflow-hidden min-h-[280px]">
           <div className="flex justify-between items-start mb-4 relative z-10">
             <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <i className="fas fa-glass-water text-blue-500"></i> 喝水打卡
                </h3>
                <p className="text-sm text-gray-500">目标: {waterGoal} 杯 / 日</p>
             </div>
             <button onClick={() => setShowGoalModal(true)} className="text-gray-400 hover:text-blue-500">
                <i className="fas fa-cog"></i>
             </button>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              <div className="relative w-36 h-36 flex items-center justify-center">
                 {/* Circular Progress Background */}
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-100 dark:text-blue-900/20" />
                    <circle 
                        cx="50" cy="50" r="45" 
                        stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - waterPercentage / 100)}
                        className="text-blue-500 transition-all duration-500 ease-out"
                        strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{waterCount}</span>
                    <span className="text-sm text-gray-400">/ {waterGoal}</span>
                 </div>
              </div>
              {waterCount >= waterGoal && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center animate-bounce-in pointer-events-none">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          🎉 目标达成!
                      </span>
                  </div>
              )}
           </div>

           <div className="flex gap-4 mt-6 relative z-10">
             <Button onClick={removeWater} variant="ghost" className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400">
                <i className="fas fa-minus"></i>
             </Button>
             <Button onClick={addWater} className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30">
                <i className="fas fa-plus mr-2"></i> 喝一杯 (250ml)
             </Button>
           </div>
           
           {/* Decorative Wave */}
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-blue-50 dark:bg-blue-900/10 opacity-50 rounded-t-[50%] transform scale-150 translate-y-12"></div>
        </Card>

        {/* 2. Stand Tracker */}
        <Card className={`flex flex-col justify-between transition-colors duration-500 ${standBg}`}>
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <i className="fas fa-person-walking text-rose-500"></i> 久坐提醒
             </h3>
             <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/50 dark:bg-black/20 ${standColor === 'text-gray-400' ? 'text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                {standStatus}
             </span>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center py-6">
              {lastStand ? (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">您已经坐了</p>
                    <h2 className={`text-6xl font-mono font-bold tracking-tighter transition-colors ${standColor}`}>
                        {sittingMinutes}<span className="text-lg ml-2 font-sans font-normal opacity-50">分钟</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-2">
                        上次活动: {new Date(lastStand).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </>
              ) : (
                  <div className="text-center opacity-50">
                      <i className="fas fa-couch text-6xl mb-4 text-gray-300 dark:text-gray-600"></i>
                      <p>还没有开始记录活动</p>
                  </div>
              )}
           </div>

           <Button onClick={recordStand} className="w-full rounded-xl bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/30">
             {lastStand ? '我刚站起来活动了' : '开始记录久坐时间'}
           </Button>
        </Card>
      </div>

      {/* 3. Breathing Exercise */}
      <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 border-teal-100 dark:border-teal-900/30">
          <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-teal-800 dark:text-teal-100 mb-2">
                      <i className="fas fa-lungs text-teal-500 mr-2"></i> 4-7-8 呼吸放松
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 text-sm mb-4">
                      感到压力大？花一分钟跟着动画深呼吸。吸气4秒，屏气2秒，呼气4秒。
                  </p>
                  <Button 
                    onClick={toggleBreathing} 
                    variant={isBreathing ? 'danger' : 'primary'}
                    className={isBreathing ? 'bg-gray-400 hover:bg-gray-500 border-none' : 'bg-teal-500 hover:bg-teal-600 border-none'}
                  >
                      {isBreathing ? '停止训练' : '开始练习'}
                  </Button>
              </div>

              <div className="flex-1 flex justify-center py-4">
                  <div className="relative w-40 h-40 flex items-center justify-center cursor-pointer" onClick={toggleBreathing}>
                      {/* Ripple Effect */}
                      {isBreathing && (
                          <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping"></div>
                      )}
                      {/* Main Breathing Circle */}
                      <div 
                        className="bg-teal-500 dark:bg-teal-400 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/40 text-white font-bold transition-all duration-[4000ms] ease-in-out z-10 hover:scale-105 active:scale-95"
                        style={{ 
                            width: isBreathing ? '100%' : '60%', 
                            height: isBreathing ? '100%' : '60%',
                            transform: `scale(${isBreathing ? breathScale : 1})`,
                            transitionDuration: breathText.includes('Hold') ? '0ms' : '4000ms'
                        }}
                      >
                          <span className="text-sm md:text-base whitespace-nowrap px-2 select-none">{breathText}</span>
                      </div>
                  </div>
              </div>
          </div>
      </Card>

      {/* Settings Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="设置喝水目标">
        <div className="space-y-6 text-center">
            <div className="text-6xl text-blue-500 mb-4">
                <i className="fas fa-glass-water"></i>
            </div>
            <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setWaterGoal(Math.max(1, waterGoal - 1))} variant="ghost" className="text-2xl w-12 h-12 rounded-full border">-</Button>
                <div className="text-center">
                    <span className="text-4xl font-bold block">{waterGoal}</span>
                    <span className="text-sm text-gray-500">杯 / 天</span>
                </div>
                <Button onClick={() => setWaterGoal(waterGoal + 1)} variant="ghost" className="text-2xl w-12 h-12 rounded-full border">+</Button>
            </div>
            <p className="text-sm text-gray-400">建议成年人每天饮水 8 杯 (约 2000ml)</p>
            <Button onClick={() => setShowGoalModal(false)} className="w-full">保存</Button>
        </div>
      </Modal>

    </div>
  );
};

export default HealthApp;
