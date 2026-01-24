import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const navigate = useNavigate();
  const location = useLocation();

  // Tutup sidebar otomatis saat pindah halaman (di mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Anggota OSIS", path: "/admin/members", icon: <Users size={20} /> },
    {
      name: "Program Kerja",
      path: "/admin/programs",
      icon: <FileText size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* 1. MOBILE HEADER (HAMBURGER) */}
      <div className="md:hidden fixed top-0 w-full bg-white z-30 border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <span className="font-bold text-gray-800 text-lg">Admin Panel</span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 2. SIDEBAR (DESKTOP & MOBILE DRAWER) */}
      {/* Overlay Gelap untuk Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside
        className={`fixed md:relative z-50 w-64 h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <h2 className="font-bold text-orange-600 text-xl">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                location.pathname === item.path
                  ? "bg-orange-50 text-orange-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
