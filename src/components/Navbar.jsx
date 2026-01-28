import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Info,
  Target,
  Users,
  BookOpen,
  Globe,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import MobileMenu from "./MobileMenu";
import logoOsis from "../assets/logoosis.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(
        () =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { name: "Tentang", id: "tentang", icon: <Info size={20} /> },
    { name: "Visi Misi", id: "visi-misi", icon: <Target size={20} /> },
    { name: "Anggota", id: "anggota", icon: <Users size={20} /> },
    { name: "Program", id: "program", icon: <BookOpen size={20} /> },
    {
      name: "KAD",
      url: "https://tally.so/r/3q06Gd",
      icon: <Globe size={20} />,
      isExternal: true,
    },
  ];

  const isTransparent = !scrolled && location.pathname === "/";

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3 border-b border-orange-100"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <img
              src={logoOsis}
              alt="Logo"
              className="w-12 h-12 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform"
            />
            <div className="flex flex-col">
              <span
                className={`font-bold text-lg leading-tight transition-colors ${
                  isTransparent ? "text-white" : "text-gray-800"
                }`}
              >
                OSIS SMK DIPO 1
              </span>
              <span
                className={`text-[10px] tracking-widest uppercase font-medium transition-colors ${
                  isTransparent ? "text-orange-100" : "text-gray-500"
                }`}
              >
                Diponegoro 1 Jakarta
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  item.isExternal
                    ? window.open(item.url)
                    : handleNavClick(item.id)
                }
                className={`text-sm font-semibold relative group py-1 transition-colors ${
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                {item.name}
                {/* Underline Effect */}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isTransparent ? "bg-white" : "bg-orange-600"
                  }`}
                />
              </button>
            ))}

            {/* Admin/Dashboard Button */}
            <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
              {user ? (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-orange-200"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              ) : (
                location.pathname !== "/login" && (
                  <Link
                    to="/login"
                    className={`p-2 rounded-full transition-colors ${
                      isTransparent
                        ? "text-white hover:bg-white/10"
                        : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <LogIn size={20} />
                  </Link>
                )
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(true)}
            className={`lg:hidden focus:outline-none transition-transform active:scale-90 ${
              isTransparent ? "text-white" : "text-gray-800"
            }`}
          >
            <Menu size={32} />
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        navLinks={navLinks}
        handleNavClick={handleNavClick}
      />
    </>
  );
}
