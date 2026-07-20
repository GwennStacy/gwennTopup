"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut 
} from "lucide-react";
import clsx from "clsx";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#090B12] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Gwenn<span className="text-primary">Admin</span>
          </h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  isActive 
                    ? "bg-primary text-white glow-primary" 
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                )}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' });
              window.location.href = '/admin/login';
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="h-16 border-b border-white/10 bg-white/5 flex items-center px-4 md:hidden">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Gwenn<span className="text-primary">Admin</span>
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
