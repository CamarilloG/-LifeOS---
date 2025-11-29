import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppDefinition } from '../types';
import { useDarkMode } from '../utils/hooks';

interface LayoutProps {
  children: React.ReactNode;
  apps: AppDefinition[];
}

const Layout: React.FC<LayoutProps> = ({ children, apps }) => {
  const [isDark, setDark] = useDarkMode();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Find current app for header title
  const currentApp = apps.find(a => a.path === location.pathname);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-white dark:bg-paper border-r border-gray-200 dark:border-gray-700 fixed h-full z-20 transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>
          <span className="ml-3 font-bold text-xl hidden lg:block">LifeOS</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isHome ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
             <i className="fas fa-grid-2 w-6 text-center"></i>
             <span className="hidden lg:block font-medium">仪表盘</span>
          </Link>
          
          <div className="my-4 border-t border-gray-100 dark:border-gray-700"></div>
          
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hidden lg:block">应用列表</p>
          {apps.map(app => (
             <Link key={app.id} to={app.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === app.path ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${location.pathname === app.path ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <i className={`fas ${app.icon}`}></i>
                </div>
                <span className="hidden lg:block text-sm font-medium truncate">{app.name}</span>
             </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => setDark(!isDark)}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} w-6 text-center`}></i>
            <span className="hidden lg:block text-sm">切换主题</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 lg:ml-64 flex flex-col min-h-screen">
        {/* Header (Mobile & Desktop) */}
        <header className="h-16 bg-white/80 dark:bg-paper/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             {/* Mobile Menu Trigger (Visual Only for now) */}
             <button className="md:hidden text-gray-600 dark:text-gray-300">
               <i className="fas fa-bars text-xl"></i>
             </button>
             <h1 className="text-lg font-bold">
               {currentApp ? (
                 <span className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-primary"></span>
                   {currentApp.name}
                 </span>
               ) : '仪表盘'}
             </h1>
           </div>
           
           <div className="flex items-center gap-4">
             {/* API Key Status (Mock) */}
             <div className="hidden sm:flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-200 dark:border-green-800">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               系统在线
             </div>
             
             {/* Profile Avatar */}
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800 cursor-pointer">
               U
             </div>
           </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
           {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-paper border-t border-gray-200 dark:border-gray-700 flex justify-around py-3 z-30 pb-safe">
          <Link to="/" className={`flex flex-col items-center gap-1 ${isHome ? 'text-primary' : 'text-gray-400'}`}>
             <i className="fas fa-grid-2 text-lg"></i>
             <span className="text-[10px]">首页</span>
          </Link>
          <Link to="/pomodoro" className={`flex flex-col items-center gap-1 ${location.pathname === '/pomodoro' ? 'text-primary' : 'text-gray-400'}`}>
             <i className="fas fa-clock text-lg"></i>
             <span className="text-[10px]">专注</span>
          </Link>
          <Link to="/finance" className={`flex flex-col items-center gap-1 ${location.pathname === '/finance' ? 'text-primary' : 'text-gray-400'}`}>
             <i className="fas fa-wallet text-lg"></i>
             <span className="text-[10px]">钱包</span>
          </Link>
           <button onClick={() => setDark(!isDark)} className="flex flex-col items-center gap-1 text-gray-400">
             <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
             <span className="text-[10px]">主题</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default Layout;