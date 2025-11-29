import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import { AppDefinition } from './types';
import { Card } from './components/ui/Common';

// App Imports
import PomodoroApp from './apps/PomodoroApp';
import FinanceApp from './apps/FinanceApp';
import RecipeApp from './apps/RecipeApp';
import TravelApp from './apps/TravelApp';
import SplitApp from './apps/SplitApp';
import FlashcardApp from './apps/FlashcardApp';
import MatrixApp from './apps/MatrixApp';
import MoodApp from './apps/MoodApp';
import MediaApp from './apps/MediaApp';
import HealthApp from './apps/HealthApp';
import CourseApp from './apps/CourseApp';
import GroceryApp from './apps/GroceryApp';

// App Registry
const apps: AppDefinition[] = [
  { id: 'pomodoro', name: '专注时钟', icon: 'fa-clock', color: 'text-indigo-500', description: '番茄工作法与习惯追踪', path: '/pomodoro' },
  { id: 'finance', name: '简易记账', icon: 'fa-wallet', color: 'text-emerald-500', description: '收支记录与预算管理', path: '/finance' },
  { id: 'recipe', name: 'AI 厨房', icon: 'fa-utensils', color: 'text-orange-500', description: '输入食材生成美味食谱', path: '/recipe', isAI: true },
  { id: 'travel', name: '旅行规划', icon: 'fa-plane', color: 'text-blue-500', description: '智能行程规划助手', path: '/travel', isAI: true },
  { id: 'split', name: 'AA 分账', icon: 'fa-users', color: 'text-pink-500', description: '朋友聚会费用分摊', path: '/split' },
  { id: 'flashcards', name: '记忆卡片', icon: 'fa-layer-group', color: 'text-yellow-500', description: '间隔重复记忆法', path: '/flashcards' },
  { id: 'matrix', name: '四象限', icon: 'fa-table-cells-large', color: 'text-purple-500', description: '艾森豪威尔任务矩阵', path: '/matrix' },
  { id: 'mood', name: '心情日记', icon: 'fa-face-smile', color: 'text-teal-500', description: '每日情绪与日记追踪', path: '/mood' },
  { id: 'books', name: '书影清单', icon: 'fa-book', color: 'text-red-400', description: '书籍与影视观看记录', path: '/books' },
  { id: 'health', name: '健康提醒', icon: 'fa-heart-pulse', color: 'text-rose-500', description: '久坐提醒与健康打卡', path: '/health' },
  { id: 'course', name: '课程计划', icon: 'fa-graduation-cap', color: 'text-cyan-500', description: '学习进度与目标管理', path: '/course' },
  { id: 'groceries', name: '购物清单', icon: 'fa-basket-shopping', color: 'text-green-600', description: '每周备餐与采购清单', path: '/groceries' },
];

const Dashboard = () => (
  <div className="space-y-8">
    <section>
        <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">欢迎回来</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">这是您今天的效率工具箱。</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apps.map(app => (
            <Link key={app.id} to={app.path} className="group">
                <Card className="h-full hover:-translate-y-1 transition-transform duration-200 border-2 border-transparent hover:border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-2xl ${app.color} group-hover:scale-110 transition-transform`}>
                            <i className={`fas ${app.icon}`}></i>
                        </div>
                        {app.isAI && (
                            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                AI
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{app.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{app.description}</p>
                </Card>
            </Link>
        ))}
        </div>
    </section>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout apps={apps}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pomodoro" element={<PomodoroApp />} />
          <Route path="/finance" element={<FinanceApp />} />
          <Route path="/recipe" element={<RecipeApp />} />
          <Route path="/travel" element={<TravelApp />} />
          <Route path="/split" element={<SplitApp />} />
          <Route path="/flashcards" element={<FlashcardApp />} />
          <Route path="/matrix" element={<MatrixApp />} />
          <Route path="/mood" element={<MoodApp />} />
          <Route path="/books" element={<MediaApp />} />
          <Route path="/health" element={<HealthApp />} />
          <Route path="/course" element={<CourseApp />} />
          <Route path="/groceries" element={<GroceryApp />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;