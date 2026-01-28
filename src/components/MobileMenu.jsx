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

  // === GSAP SETUP (SAMA PERSIS FEEL REFERENSI) ===
  useEffect(() => {
    const ctx = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true });

      // Overlay
      timeline.current.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Menu slide
      timeline.current.to(
        menuRef.current,
        {
          x: "0%",
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.2",
      );

      // Header
      timeline.current.from(
        ".mobile-header",
        {
          y: -20,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3",
      );

      // Items
      timeline.current.from(
        ".mobile-item",
        {
          x: 50,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
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
      timeline.current.reverse();
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // === RENDER ===
  return createPortal(
    <div ref={containerRef} className="absolute top-0 left-0 w-0 h-0 z-[9999]">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm invisible opacity-0"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl translate-x-full flex flex-col"
      >
        {/* Header */}
        <div className="mobile-header flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-800">Menu</span>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <button
            onClick={() => {
              handleNavClick("top", "scroll");
              onClose();
            }}
            className="mobile-item w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold rounded-xl hover:bg-orange-50 hover:text-orange-600"
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
              className="mobile-item w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold rounded-xl hover:bg-orange-50 hover:text-orange-600"
            >
              {item.icon}
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
        <div className="mobile-item p-6 border-t bg-gray-50">
          <Link
            to={user ? "/admin/dashboard" : "/login"}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold"
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
