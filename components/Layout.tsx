
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppDefinition } from '../types';
import { useDarkMode } from '../utils/hooks';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { SettingsModal } from './SettingsModal';
import { Button } from './ui/Common';

interface LayoutProps {
  children: React.ReactNode;
  apps: AppDefinition[];
}

const Layout: React.FC<LayoutProps> = ({ children, apps }) => {
  const [isDark, setDark] = useDarkMode();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Auth State
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
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

        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2 custom-scrollbar">
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

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <button 
            onClick={() => setSettingsModalOpen(true)}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i className="fas fa-cog w-6 text-center"></i>
            <span className="hidden lg:block text-sm">系统设置</span>
          </button>
          
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
             {user ? (
                // Logged In State
                <div className="relative">
                    <div 
                        className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors pr-3"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{user.name}</span>
                            <span className="text-[10px] text-green-500 flex items-center gap-1">
                                <i className="fas fa-check-circle"></i> 已同步
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800">
                            {user.avatar || user.name[0]}
                        </div>
                    </div>
                    
                    {/* User Dropdown */}
                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-paper rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-scale-in">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                                    <p className="text-sm font-bold truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>
                                <button onClick={() => { setSettingsModalOpen(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <i className="fas fa-cog mr-2"></i> 账号设置
                                </button>
                                <button 
                                    onClick={() => { logout(); setShowUserMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                >
                                    <i className="fas fa-sign-out-alt mr-2"></i> 退出登录
                                </button>
                            </div>
                        </>
                    )}
                </div>
             ) : (
                // Guest State
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                    <i className="fas fa-cloud mr-2"></i>
                    <span className="hidden sm:inline">启用云同步</span>
                    <span className="sm:hidden">同步</span>
                </Button>
             )}
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
           <button onClick={() => setSettingsModalOpen(true)} className="flex flex-col items-center gap-1 text-gray-400">
             <i className="fas fa-cog text-lg"></i>
             <span className="text-[10px]">设置</span>
          </button>
        </nav>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  );
};

export default Layout;
