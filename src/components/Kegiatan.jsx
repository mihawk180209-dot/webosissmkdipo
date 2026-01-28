// src/components/Kegiatan.jsx
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  Calendar,
  ChevronRight,
  ArrowRight,
  Layers,
  ImageOff,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

export default function Kegiatan() {
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref untuk Scope GSAP
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchLatest() {
      setLoading(true);
      const { data, error } = await supabase
        .from("kegiatan")
        .select("*")
        .order("date", { ascending: false })
        .limit(3);

      if (error) console.log("error", error);
      if (data) setLatest(data);
      setLoading(false);
    }
    fetchLatest();
  }, []);

  // GSAP Animation Logic (Anti Ghosting Fixed)
  useLayoutEffect(() => {
    // HANYA return jika masih loading.
    // JANGAN return jika data kosong, karena Header tetap harus muncul!
    if (loading) return;

    let ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      // 1. Header Reveal (SELALU JALAN)
      tl.to(".gsap-header", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });

      // 2. Logic Cabang: Jika ada data, animate Cards. Jika tidak, animate Empty State.
      if (latest.length > 0) {
        // Cards Reveal
        tl.to(
          ".gsap-card",
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.15,
          },
          "-=0.6",
        );

        // Button Reveal
        tl.to(
          ".gsap-btn",
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.4",
        );
      } else {
        // Empty State Reveal (Tambahan biar empty state juga smooth)
        tl.fromTo(
          ".gsap-empty",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.4",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, latest]);

  return (
    <section
      ref={containerRef}
      id="kegiatan"
      className="py-24 bg-gray-50 relative overflow-hidden"
    >
      {/* Hiasan Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full blur-[100px] opacity-20 -z-10" />

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 max-w-2xl">
          <div className="gsap-header opacity-0 translate-y-12 flex items-center gap-2 text-orange-600 font-bold mb-2">
            <Layers size={20} />
            <span className="uppercase tracking-wider text-xs">
              Dokumentasi
            </span>
          </div>
          <h2 className="gsap-header opacity-0 translate-y-12 text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Agenda & Kegiatan Terbaru
          </h2>
          <p className="gsap-header opacity-0 translate-y-12 text-gray-600 leading-relaxed text-lg">
            Lihat keseruan dan dokumentasi kegiatan terbaru dari OSIS SMK
            Diponegoro 1 Jakarta.
          </p>
        </div>

        {/* LOGIC RENDERING */}
        {loading ? (
          /* TAMPILAN SKELETON */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col"
              >
                <div className="h-60 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : latest.length > 0 ? (
          /* TAMPILAN DATA ASLI */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latest.map((item) => (
              <Link
                to={`/kegiatan/${item.id}`}
                key={item.id}
                className="gsap-card opacity-0 translate-y-12 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Image Wrapper */}
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider border border-orange-100">
                    {item.category || "Event"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-medium">
                    <Calendar size={14} className="text-orange-500" />
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <span className="text-orange-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca Selengkapnya <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* EMPTY STATE (Tambahkan class gsap-empty) */
          <div className="gsap-empty flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 text-center opacity-0">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ImageOff className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Belum Ada Kegiatan
            </h3>
            <p className="text-gray-500 max-w-md">
              Saat ini belum ada dokumentasi kegiatan yang diunggah. Pantau
              terus ya!
            </p>
          </div>
        )}

        {/* Tombol Lihat Semua */}
        {!loading && latest.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              to="/kegiatan"
              className="gsap-btn opacity-0 translate-y-12 group flex items-center gap-2 px-8 py-4 rounded-full bg-white border border-orange-200 text-orange-600 font-bold hover:bg-orange-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-orange-200"
            >
              Lihat Galeri Lengkap
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
