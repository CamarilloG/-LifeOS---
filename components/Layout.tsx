
import React, { useState, useEffect } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Find current app for header title
  const currentApp = apps.find(a => a.path === location.pathname);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar (Responsive) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-paper border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none
        md:translate-x-0 md:static md:inset-auto md:w-20 lg:w-64 md:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-center md:justify-start w-full">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">L</div>
             <span className="ml-3 font-bold text-xl md:hidden lg:block">LifeOS</span>
          </div>
          {/* Mobile Close Button */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2 custom-scrollbar">
          <Link to="/" className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${isHome ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
             <div className="w-6 flex justify-center"><i className="fas fa-house text-lg"></i></div>
             <span className="md:hidden lg:block font-medium">仪表盘</span>
          </Link>
          
          <div className="my-4 border-t border-gray-100 dark:border-gray-700 mx-2"></div>
          
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 md:hidden lg:block">应用列表</p>
          {apps.map(app => (
             <Link key={app.id} to={app.path} className={`flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors ${location.pathname === app.path ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 ${location.pathname === app.path ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <i className={`fas ${app.icon}`}></i>
                </div>
                <span className="md:hidden lg:block text-sm font-medium truncate">{app.name}</span>
             </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2 mb-safe md:mb-0">
          <button 
            onClick={() => setSettingsModalOpen(true)}
            className="w-full flex items-center justify-start md:justify-center lg:justify-start gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="w-6 flex justify-center"><i className="fas fa-cog"></i></div>
            <span className="md:hidden lg:block text-sm">系统设置</span>
          </button>
          
          <button 
            onClick={() => setDark(!isDark)}
            className="w-full flex items-center justify-start md:justify-center lg:justify-start gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="w-6 flex justify-center"><i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i></div>
            <span className="md:hidden lg:block text-sm">切换主题</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 lg:ml-64 flex flex-col min-h-screen">
        {/* Header (Mobile & Desktop) */}
        <header className="h-16 bg-white/80 dark:bg-paper/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             {/* Mobile Menu Toggle */}
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg active:bg-gray-200"
             >
                <i className="fas fa-bars text-xl"></i>
             </button>

             <h1 className="text-lg font-bold">
               {currentApp ? (
                 <span className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-primary hidden sm:block"></span>
                   {currentApp.name}
                 </span>
               ) : '仪表盘'}
             </h1>
           </div>
           
           <div className="flex items-center gap-3">
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800 shadow-sm">
                            {user.avatar || user.name[0]}
                        </div>
                    </div>
                    
                    {/* User Dropdown */}
                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-paper rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-scale-in origin-top-right">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2 bg-gray-50/50 dark:bg-slate-800/50">
                                    <p className="text-sm font-bold truncate text-gray-800 dark:text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <button onClick={() => { setSettingsModalOpen(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2">
                                    <i className="fas fa-cog text-gray-400 w-4"></i> 系统设置
                                </button>
                                <button 
                                    onClick={() => { logout(); setShowUserMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                                >
                                    <i className="fas fa-sign-out-alt w-4"></i> 退出登录
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
                    <i className="fas fa-cloud mr-1.5"></i>
                    <span className="hidden sm:inline">启用云同步</span>
                    <span className="sm:hidden">同步</span>
                </Button>
             )}
           </div>
        </header>

        {/* Content Area with extra padding for mobile bottom nav */}
        <div className="p-3 md:p-8 flex-1 overflow-x-hidden pb-28 md:pb-8">
           {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white/85 dark:bg-paper/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 flex justify-around pt-3 pb-safe-nav z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link to="/" className={`flex flex-col items-center gap-1 px-3 rounded-xl transition-colors ${isHome ? 'text-primary' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
             <i className="fas fa-house text-xl"></i>
             <span className="text-[10px] font-medium">首页</span>
          </Link>
          <Link to="/pomodoro" className={`flex flex-col items-center gap-1 px-3 rounded-xl transition-colors ${location.pathname === '/pomodoro' ? 'text-primary' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
             <i className="fas fa-clock text-xl"></i>
             <span className="text-[10px] font-medium">专注</span>
          </Link>
          <Link to="/finance" className={`flex flex-col items-center gap-1 px-3 rounded-xl transition-colors ${location.pathname === '/finance' ? 'text-primary' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
             <i className="fas fa-wallet text-xl"></i>
             <span className="text-[10px] font-medium">钱包</span>
          </Link>
           <button onClick={() => setSettingsModalOpen(true)} className="flex flex-col items-center gap-1 px-3 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800">
             <i className="fas fa-cog text-xl"></i>
             <span className="text-[10px] font-medium">设置</span>
          </button>
        </nav>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  );
};

export default Layout;
