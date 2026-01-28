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

  // === GSAP SETUP ===
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(menuRef.current, { xPercent: 100 });
      gsap.set(overlayRef.current, { autoAlpha: 0 });

      gsap.set(".mobile-header", { opacity: 1, y: 0 });
      gsap.set(".mobile-item", { opacity: 1, x: 0 });

      timeline.current = gsap.timeline({ paused: true });

      // Overlay
      timeline.current.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Menu panel
      timeline.current.to(
        menuRef.current,
        {
          xPercent: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.2",
      );

      // Header
      timeline.current.fromTo(
        ".mobile-header",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3",
      );

      // Menu items
      timeline.current.fromTo(
        ".mobile-item",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "back.out(1.2)",
        },
        "-=0.2",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // === OPEN / CLOSE ===
  useEffect(() => {
    if (!timeline.current) return;

    if (isOpen) {
      timeline.current.play();
      document.body.style.overflow = "hidden";
    } else {
      timeline.current.timeScale(1.2).reverse();
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // === RENDER ===
  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl pointer-events-auto flex flex-col h-full will-change-transform"
      >
        {/* Header */}
        <div className="mobile-header flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-800">Menu</span>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <button
            onClick={() => {
              handleNavClick("top", "scroll");
              onClose();
            }}
            className="mobile-item w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
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
              className="mobile-item w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all group"
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

        {/* Footer */}
        <div className="mobile-item p-6 bg-gray-50 border-t border-gray-100 mt-auto">
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
