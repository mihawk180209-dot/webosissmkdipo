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
      // RESET STATE AWAL
      gsap.set(menuRef.current, { xPercent: 100 });
      gsap.set(overlayRef.current, { autoAlpha: 0 });

      // TIMELINE SETUP
      timeline.current = gsap.timeline({ paused: true });

      // 1. Overlay (Background Gelap)
      timeline.current.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // 2. Menu Panel (Wadah Utamanya)
      timeline.current.to(
        menuRef.current,
        {
          xPercent: 0,
          duration: 0.5,
          ease: "power4.out", // Power4 lebih dramatis ngeremnya (alus banget di akhir)
        },
        "-=0.3", // Mulai barengan sama overlay
      );

      // 3. Item Menu (Berderet Alus)
      timeline.current.fromTo(
        ".mobile-anim",
        {
          x: 80, // Mulai dari kanan agak jauh
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1, // Jeda antar item 0.1 detik (ini yang bikin efek berderet)
          ease: "power3.out", // Easing standar yang smooth, gak mantul
        },
        "-=0.3", // Item mulai masuk pas panel menu belum sampe full (biar flow-nya nyambung)
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle Play/Reverse logic
  useEffect(() => {
    if (timeline.current) {
      if (isOpen) {
        timeline.current.play();
      } else {
        timeline.current.timeScale(1.3).reverse(); // Pas nutup dicepetin dikit (1.5x) biar sat-set
      }
    }
  }, [isOpen]);

  // Render Portal
  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto opacity-0 invisible"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl pointer-events-auto flex flex-col h-full will-change-transform"
      >
        {/* Header */}
        <div className="mobile-anim flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-800">Menu</span>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation List */}
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
              className="mobile-anim w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all group"
            >
              <span className="text-gray-500 group-hover:text-orange-600 transition-colors">
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

        {/* Footer Action */}
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
