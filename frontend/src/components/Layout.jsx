import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, List, MessageSquare, User } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Schemes', path: '/schemes', icon: List },
    { name: 'Assistant', path: '/assistant', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight">AccessMind</span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
