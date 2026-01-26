import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  ChevronRight,
  Home,
  Info,
  Target,
  Users,
  BookOpen,
  Globe,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
// Hapus import framer-motion
// import { motion, AnimatePresence } from "framer-motion";

// Import GSAP
import gsap from "gsap";

import logoOsis from "../assets/logoosis.png"; // Pastikan path benar

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Refs untuk GSAP
  const containerRef = useRef(null);
  const menuTimeline = useRef(null);

  // Cek User Login
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
  }, []);

  // Efek Scroll Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === GSAP ANIMATION SETUP ===
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Setup Timeline untuk Menu Mobile (Paused di awal)
      const tl = gsap.timeline({ paused: true });

      // 1. Setup kondisi awal (Hidden)
      gsap.set(".mobile-backdrop", { autoAlpha: 0 });
      gsap.set(".mobile-drawer", { x: "100%" });
      gsap.set(".mobile-item", { x: 50, opacity: 0 }); // Item menu geser sedikit

      // 2. Susun Animasi
      tl.to(".mobile-backdrop", {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          ".mobile-drawer",
          {
            x: "0%",
            duration: 0.5,
            ease: "power4.out", // Efek slide lebih smooth
          },
          "-=0.2",
        ) // Mulai sedikit lebih cepat sebelum backdrop selesai
        .to(
          ".mobile-item",
          {
            x: 0,
            opacity: 1,
            stagger: 0.1, // Muncul berurutan (keren!)
            duration: 0.4,
            ease: "back.out(1.2)",
          },
          "-=0.3",
        );

      menuTimeline.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Trigger Animasi saat state isOpen berubah
  useEffect(() => {
    if (menuTimeline.current) {
      if (isOpen) {
        menuTimeline.current.play();
      } else {
        menuTimeline.current.reverse();
      }
    }
  }, [isOpen]);

  // Logika Navigasi Pintar
  const handleNavClick = (id) => {
    setIsOpen(false); // Tutup menu (trigger reverse animasi)

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
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

  // Logic Warna Text
  const isTransparent = !scrolled && location.pathname === "/";
  const textColor = isTransparent ? "text-white" : "text-gray-800";
  const subTextColor = isTransparent ? "text-orange-100" : "text-gray-500";

  return (
    <div ref={containerRef}>
      {/* NAVBAR UTAMA */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md border-b border-orange-100 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-3 group z-50 relative"
            >
              <img
                src={logoOsis}
                alt="Logo OSIS"
                className="w-12 h-12 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform"
              />
              <div className="flex flex-col">
                <span
                  className={`font-bold text-lg leading-tight transition-colors ${textColor}`}
                >
                  OSIS SMK DIPO 1
                </span>
                <span
                  className={`text-[10px] tracking-widest uppercase font-medium transition-colors ${subTextColor}`}
                >
                  Diponegoro 1 Jakarta
                </span>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium transition-colors relative group flex items-center gap-1 ${
                      isTransparent
                        ? "text-white/90 hover:text-white"
                        : "text-gray-600 hover:text-orange-600"
                    }`}
                  >
                    {item.name}
                    <ExternalLink
                      size={14}
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-sm font-medium transition-colors relative group ${
                      isTransparent
                        ? "text-white/90 hover:text-white"
                        : "text-gray-600 hover:text-orange-600"
                    }`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ),
              )}

              {user ? (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setIsOpen(true)}
              className={`md:hidden focus:outline-none transition-transform active:scale-90 ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU - SIDE DRAWER (GSAP Version) */}
      {/* Kita render selalu, tapi sembunyikan via CSS/GSAP (visibility:hidden) agar animasi exit jalan */}

      {/* 1. Backdrop Gelap (Blur) */}
      <div
        onClick={() => setIsOpen(false)}
        className="mobile-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden invisible"
      />

      {/* 2. Drawer Panel (Slide dari Kanan) */}
      <div className="mobile-drawer fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[70] shadow-2xl md:hidden flex flex-col">
        {/* Header Drawer */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <span className="font-bold text-xl text-gray-800 mobile-item">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors mobile-item"
          >
            <X size={24} />
          </button>
        </div>

        {/* List Menu */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          <button
            onClick={() => handleNavClick("home")}
            className="mobile-item w-full flex items-center gap-4 px-4 py-4 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all font-medium text-left"
          >
            <Home size={22} /> Beranda
          </button>

          {navLinks.map((item) =>
            item.isExternal ? (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-item w-full flex items-center gap-4 px-4 py-4 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all font-medium text-left group"
              >
                <span className="text-gray-400 group-hover:text-orange-500 transition-colors">
                  {item.icon}
                </span>
                {item.name}
                <ExternalLink
                  size={16}
                  className="ml-auto opacity-50 group-hover:opacity-100"
                />
              </a>
            ) : (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.id)}
                className="mobile-item w-full flex items-center gap-4 px-4 py-4 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all font-medium text-left group"
              >
                <span className="text-gray-400 group-hover:text-orange-500 transition-colors">
                  {item.icon}
                </span>
                {item.name}
                <ChevronRight
                  size={16}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            ),
          )}
        </div>

        {/* Footer Drawer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 mobile-item">
          {user ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200"
            >
              <LayoutDashboard size={20} />
              Buka Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-600 rounded-xl font-bold transition-all"
            >
              <LogIn size={20} /> Login Admin
            </Link>
          )}
          <p className="text-center text-xs text-gray-400 mt-4">
            &copy; 2026 OSIS SMK DIPO 1
          </p>
        </div>
      </div>
    </div>
  );
}
