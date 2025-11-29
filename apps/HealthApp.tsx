import React from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button } from '../components/ui/Common';

const HealthApp: React.FC = () => {
  const [waterCount, setWaterCount] = useLocalStorage<number>('health-water', 0);
  const [lastStand, setLastStand] = useLocalStorage<string>('health-stand', new Date().toISOString());

  const addWater = () => setWaterCount(prev => prev + 1);
  const resetWater = () => setWaterCount(0);
  
  const recordStand = () => setLastStand(new Date().toISOString());

  // Simple formatter for display
  const lastStandTime = new Date(lastStand).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">今日健康打卡</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Water Tracker */}
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4 border-t-4 border-t-blue-500">
           <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 mb-2">
             <i className="fas fa-glass-water text-3xl"></i>
           </div>
           <div>
             <h3 className="text-4xl font-bold text-gray-800 dark:text-white">{waterCount}</h3>
             <p className="text-sm text-gray-500">杯水 (250ml/杯)</p>
           </div>
           <div className="flex gap-2 w-full">
             <Button onClick={addWater} className="flex-1" variant="secondary">+</Button>
             <Button onClick={resetWater} variant="ghost" className="px-2"><i className="fas fa-rotate-right"></i></Button>
           </div>
        </Card>

        {/* Stand Tracker */}
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4 border-t-4 border-t-rose-500">
           <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mb-2">
             <i className="fas fa-person-walking text-3xl"></i>
           </div>
           <div>
             <p className="text-sm text-gray-500 mb-1">上次活动时间</p>
             <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{lastStandTime}</h3>
           </div>
           <Button onClick={recordStand} className="w-full bg-rose-500 hover:bg-rose-600">
             我刚才动了一下
           </Button>
        </Card>
      </div>

      <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30">
        <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2"><i className="fas fa-lightbulb mr-2"></i>健康小贴士</h4>
        <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>建议每小时起身活动 3-5 分钟。</li>
          <li>成年人每天建议饮水 1500-1700 毫升。</li>
          <li>看屏幕 20 分钟，请眺望 20 英尺（6米）远处 20 秒。</li>
        </ul>
      </Card>
    </div>
  );
};

export default HealthApp;