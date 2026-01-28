// src/components/MobileMenu.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  LayoutDashboard,
  LogIn,
  ChevronRight,
  Home,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const MobileMenu = ({ isOpen, onClose, user, navLinks, handleNavClick }) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const menuRef = useRef(null);
  const timeline = useRef(null);

  useEffect(() => {
    // Setup GSAP Context
    let ctx = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true });

      // 1. Animasi Overlay
      timeline.current.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
      });

      // 2. Animasi Menu Panel (Slide In)
      timeline.current.to(
        menuRef.current,
        { x: "0%", duration: 0.5, ease: "power3.out" },
        "-=0.2",
      );

      // 3. Animasi Item dalam Menu (Stagger)
      // Menggunakan .fromTo agar state awal & akhir selalu pasti (anti-bug invisible)
      timeline.current.fromTo(
        ".mobile-anim",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
        "-=0.3",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle Play/Reverse
  useEffect(() => {
    if (timeline.current) {
      if (isOpen) {
        timeline.current.play();
      } else {
        timeline.current.reverse();
      }
    }
  }, [isOpen]);

  // Render ke Body menggunakan Portal
  return createPortal(
    <div
      ref={containerRef}
      // PERBAIKAN 1: Gunakan fixed inset-0 agar container selalu cover layar
      // pointer-events-none agar tidak nge-block klik jika ada area transparan glitch
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      {/* Overlay Background */}
      <div
        ref={overlayRef}
        // PERBAIKAN 2: pointer-events-auto agar bisa diklik untuk close
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto invisible opacity-0"
        onClick={onClose}
      />

      {/* Panel Menu */}
      <div
        ref={menuRef}
        // PERBAIKAN 3: pointer-events-auto agar menu bisa diinteraksi
        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl pointer-events-auto translate-x-full flex flex-col h-full"
      >
        {/* Header Menu */}
        <div className="mobile-anim flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-800">Menu</span>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* List Link */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <button
            onClick={() => {
              handleNavClick("top", "scroll");
              onClose();
            }}
            className="mobile-anim w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
          >
            <Home size={22} /> Beranda
          </button>

          {navLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.isExternal) {
                  window.open(item.url);
                } else {
                  handleNavClick(item.target, item.type);
                }
                onClose();
              }}
              className="mobile-anim w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
            >
              {/* Icon dirender langsung dari props */}
              <span className="text-gray-500 group-hover:text-orange-600">
                {item.icon}
              </span>
              {item.name}
              {item.isExternal ? (
                <ExternalLink size={16} className="ml-auto opacity-50" />
              ) : (
                <ChevronRight size={16} className="ml-auto opacity-50" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer / Login Button */}
        <div className="mobile-anim p-6 bg-gray-50 border-t border-gray-100 mt-auto">
          <Link
            to={user ? "/admin/dashboard" : "/login"}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition-all"
          >
            {user ? (
              <>
                <LayoutDashboard size={20} /> Dashboard
              </>
            ) : (
              <>
                <LogIn size={20} /> Login Admin
              </>
            )}
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MobileMenu;
