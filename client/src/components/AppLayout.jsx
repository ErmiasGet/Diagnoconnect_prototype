import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, HeartPulse, LogOut, Menu, PanelLeftClose, PanelLeft, X } from 'lucide-react';

function NavIcon({ name, className }) {
  const Cmp = Icons[name] || Icons.Circle;
  return <Cmp className={className} strokeWidth={2} />;
}

export default function AppLayout({ nav }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .get('/notifications')
      .then((r) => setUnread(r.data.filter((n) => !n.read).length))
      .catch(() => {});
  }, [user, location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-brand-500 to-care-500 text-white shadow-md shadow-brand-500/20'
        : 'text-slate-300 hover:bg-sidebar-50 hover:text-white'
    }`;

  const sidebarW = collapsed ? 'lg:w-20' : 'lg:w-64';

  return (
    <div className="min-h-screen flex bg-surface">
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar shadow-2xl transition-all duration-300 lg:static lg:translate-x-0 ${sidebarW} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className={`flex items-center gap-2.5 border-b border-white/5 px-4 py-4 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-lg shadow-brand-500/20">
            <HeartPulse className="h-5 w-5" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-bold text-white leading-tight truncate">DiagnoConnect</div>
              <div className="text-[11px] text-slate-400 truncate">Care coordination</div>
            </div>
          )}
          <button
            type="button"
            className="ml-auto hidden lg:flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          <nav className="space-y-1">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.end} title={collapsed ? item.label : undefined}>
                <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={`border-t border-white/5 p-3 ${collapsed ? 'lg:px-2' : ''}`}>
          <div className={`rounded-xl bg-white/5 p-3 backdrop-blur-sm ${collapsed ? 'lg:p-2' : ''}`}>
            {!collapsed && (
              <>
                <div className="font-semibold text-white truncate text-sm">{user?.fullName}</div>
                <div className="text-xs text-slate-400 capitalize truncate mt-0.5">{user?.role?.replace('_', ' ')}</div>
              </>
            )}
            <button
              type="button"
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all ${collapsed ? 'lg:px-0' : ''}`}
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && 'Log out'}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl lg:px-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-brand-500 to-care-500 bg-clip-text text-transparent">Workspace</p>
            <h1 className="text-lg font-bold text-slate-900 truncate capitalize">
              {location.pathname.replace('/app', '').replace(/\//g, ' ').trim() || 'Dashboard'}
            </h1>
          </div>
          <NavLink
            to="/app/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-brand-200 transition-all"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white shadow-md">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </NavLink>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-6xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
