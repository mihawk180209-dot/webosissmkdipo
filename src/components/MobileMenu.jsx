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
    let ctx = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true });
      timeline.current.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
      timeline.current.to(
        menuRef.current,
        { x: "0%", duration: 0.5, ease: "power3.out" },
        "-=0.2",
      );
      timeline.current.from(
        ".mobile-anim",
        { x: 30, opacity: 0, stagger: 0.08 },
        "-=0.3",
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (timeline.current)
      isOpen ? timeline.current.play() : timeline.current.reverse();
  }, [isOpen]);

  return createPortal(
    <div ref={containerRef} className="absolute top-0 left-0 w-0 h-0 z-[9999]">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] invisible opacity-0"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[10000] translate-x-full flex flex-col"
      >
        <div className="mobile-anim flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold">Menu Navigasi</span>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <button
            onClick={() => {
              handleNavClick("home");
              onClose();
            }}
            className="mobile-anim w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold"
          >
            <Home size={22} /> Beranda
          </button>
          {navLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.isExternal) window.open(item.url);
                else handleNavClick(item.id);
                onClose();
              }}
              className="mobile-anim w-full flex items-center gap-4 px-4 py-4 text-gray-600 font-semibold"
            >
              {item.icon} {item.name}{" "}
              {item.isExternal ? (
                <ExternalLink size={16} className="ml-auto" />
              ) : (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>
        <div className="mobile-anim p-6 bg-gray-50">
          <Link
            to={user ? "/admin/dashboard" : "/login"}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg"
          >
            {user ? (
              <>
                <LayoutDashboard /> Dashboard
              </>
            ) : (
              <>
                <LogIn /> Login Admin
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
