
import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { generateTravelItinerary } from '../services/geminiService';
import { TravelItinerary, TravelActivity } from '../types';

const SAMPLE_ITINERARY: TravelItinerary = {
    city: "京都 (Kyoto)",
    days: [
      {
        day: 1,
        theme: "古都寺庙巡礼",
        activities: {
          morning: { time: "09:00", activity: "伏见稻荷大社", description: "探索著名的千本鸟居，感受神圣的氛围，建议早起避开人流。", budget: "Low" },
          afternoon: { time: "14:00", activity: "清水寺", description: "参观历史悠久的木造寺院，在清水舞台俯瞰京都市景，漫步三年坂。", budget: "Medium" },
          evening: { time: "18:30", activity: "祇园角", description: "在花见小路寻找艺伎的踪迹，享用正宗的京怀石料理。", budget: "High" }
        }
      },
      {
        day: 2,
        theme: "岚山自然风光",
        activities: {
          morning: { time: "09:30", activity: "岚山竹林小径", description: "漫步在幽静的竹林中，聆听风吹过竹叶的声音。", budget: "Low" },
          afternoon: { time: "13:00", activity: "天龙寺与渡月桥", description: "游览世界遗产天龙寺的庭园，随后在渡月桥边欣赏桂川美景。", budget: "Medium" },
          evening: { time: "19:00", activity: "岚山温泉", description: "在岚山地区的温泉旅馆放松身心，洗去一天的疲惫。", budget: "High" }
        }
      },
      {
        day: 3,
        theme: "金阁与枯山水",
        activities: {
          morning: { time: "10:00", activity: "金阁寺 (鹿苑寺)", description: "欣赏倒映在镜湖池中的金碧辉煌的舍利殿。", budget: "Medium" },
          afternoon: { time: "14:00", activity: "龙安寺", description: "坐在缘侧欣赏著名的枯山水石庭，体验禅意。", budget: "Medium" },
          evening: { time: "18:00", activity: "先斗町", description: "在鸭川旁的窄巷中探店，体验京都的夜生活与居酒屋文化。", budget: "Medium" }
        }
      }
    ]
};

const TravelApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    try {
        const result = await generateTravelItinerary(city, days);
        setItinerary(result);
        setActiveDay(1);
    } catch (e) {
        alert("生成失败，请检查API Key配置");
    } finally {
        setLoading(false);
    }
  };

  const loadSample = () => {
      setCity(SAMPLE_ITINERARY.city);
      setItinerary(SAMPLE_ITINERARY);
      setActiveDay(1);
  };

  const renderActivityCard = (title: string, data: TravelActivity, color: string) => (
      <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-paper ${color}`}></div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{title} · {data.time}</span>
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{data.activity}</h4>
                  </div>
                  <Badge color={data.budget === 'High' ? 'red' : (data.budget === 'Medium' ? 'yellow' : 'green')}>
                      {data.budget === 'High' ? '高预算' : (data.budget === 'Medium' ? '中等' : '免费/低')}
                  </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{data.description}</p>
          </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Input Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">旅行规划师 TravelGenius</h2>
            <p className="text-blue-100 mb-6 max-w-lg">输入目的地，AI 即使为您生成精确到小时的个性化行程，包含交通建议与预算预估。</p>
            
            <form onSubmit={handlePlan} className="flex flex-col sm:flex-row gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                <Input 
                    value={city} 
                    onChange={e => setCity(e.target.value)} 
                    placeholder="我想去... (例如: 东京, 巴黎)" 
                    className="flex-1 bg-white/90 text-gray-900 border-none focus:ring-0 placeholder:text-gray-400"
                    required 
                />
                <div className="w-full sm:w-24">
                     <Input 
                        type="number" 
                        min={1} 
                        max={7} 
                        value={days} 
                        onChange={e => setDays(parseInt(e.target.value))} 
                        className="bg-white/90 text-gray-900 border-none text-center"
                        title="天数"
                     />
                </div>
                <Button type="submit" disabled={loading} className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-none font-bold">
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : '开始规划'}
                </Button>
            </form>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-200">
                <span>没想好去哪？</span>
                <button onClick={loadSample} className="underline hover:text-white transition-colors">
                    加载示例 (京都之旅)
                </button>
            </div>
        </div>
        
        <i className="fas fa-plane-departure absolute -bottom-10 -right-10 text-[180px] text-white opacity-10"></i>
      </div>

      {/* Result Section */}
      {itinerary && (
        <div className="animate-fade-in">
             <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <i className="fas fa-map-location-dot text-blue-500"></i>
                        {itinerary.city}
                    </h3>
                    <p className="text-gray-500">{itinerary.days.length} 天行程概览</p>
                </div>
             </div>

             <div className="flex flex-col md:flex-row gap-8">
                 {/* Day Tabs (Vertical on Desktop) */}
                 <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 md:w-48 sticky top-20 h-fit">
                    {itinerary.days.map((d) => (
                        <button
                            key={d.day}
                            onClick={() => setActiveDay(d.day)}
                            className={`flex-shrink-0 text-left px-4 py-3 rounded-xl transition-all border ${
                                activeDay === d.day
                                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                : 'bg-white dark:bg-paper text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span className="text-xs opacity-80 block uppercase tracking-wider">Day {d.day}</span>
                            <span className="font-bold truncate block">{d.theme}</span>
                        </button>
                    ))}
                 </div>

                 {/* Timeline Content */}
                 <div className="flex-1">
                     {itinerary.days.map((d) => (
                         <div key={d.day} className={activeDay === d.day ? 'block animate-scale-in' : 'hidden'}>
                            <Card className="p-8">
                                <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">第 {d.day} 天：{d.theme}</h2>
                                    <div className="flex gap-2">
                                        <Badge color="blue">行程紧凑</Badge>
                                        <Badge color="purple">文化探索</Badge>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    {renderActivityCard("上午", d.activities.morning, "bg-yellow-400")}
                                    {renderActivityCard("下午", d.activities.afternoon, "bg-orange-400")}
                                    {renderActivityCard("晚上", d.activities.evening, "bg-indigo-400")}
                                </div>
                            </Card>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
      )}
      
      {!itinerary && !loading && (
          <div className="text-center py-20 opacity-50">
              <i className="fas fa-earth-asia text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">世界那么大，我想去看看</p>
          </div>
      )}
    </div>
  );
};
export default TravelApp;
