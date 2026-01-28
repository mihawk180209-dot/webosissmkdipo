// src/pages/AllKegiatan.jsx
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Search, LayoutGrid } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gsap from "gsap";

export default function AllKegiatan() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Scope GSAP
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchActivities();
  }, []);

  async function fetchActivities() {
    setLoading(true);
    const { data, error } = await supabase
      .from("kegiatan")
      .select("*")
      .order("date", { ascending: false });

    if (error) console.error("Error fetching activities:", error);
    else setActivities(data || []);
    setLoading(false);
  }

  // GSAP Animation Logic
  useLayoutEffect(() => {
    // Jalankan animasi layout (Header & Search) saat komponen mount
    let ctx = gsap.context(() => {
      // Animate Header Elements
      gsap.from(".page-header-anim", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Animate Search Bar
      gsap.from(".search-anim", {
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(1.7)",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []); // Run once on mount

  // Animation Trigger saat Data Selesai Loading atau Search Berubah
  useLayoutEffect(() => {
    if (!loading && activities.length > 0) {
      // Beri sedikit delay agar DOM render dulu
      let ctx = gsap.context(() => {
        gsap.fromTo(
          ".card-item-anim",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05, // Cepat dan memuaskan
            ease: "power2.out",
            overwrite: "auto", // Mencegah konflik animasi saat ngetik cepat di search
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, search, activities]); // Re-run saat loading kelar atau search berubah

  const filteredActivities = activities.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={containerRef}>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-20">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-100 mb-10">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl">
              <span className="page-header-anim text-orange-600 font-bold tracking-wider text-sm uppercase mb-2 block">
                Galeri & Dokumentasi
              </span>
              <h1 className="page-header-anim text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Semua Kegiatan Sekolah
              </h1>
              <p className="page-header-anim text-gray-500 text-lg">
                Arsip lengkap kegiatan OSIS dan sekolah SMK Diponegoro 1
                Jakarta.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="search-anim flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
              />
            </div>
            <div className="text-gray-500 text-sm font-medium flex items-center gap-2">
              <LayoutGrid size={18} />
              Total {filteredActivities.length} Kegiatan
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm h-96 animate-pulse"
                >
                  <div className="h-56 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredActivities.map((item) => (
                <Link
                  to={`/kegiatan/${item.id}`}
                  key={item.id}
                  // Tambah class card-item-anim untuk target animasi
                  className="card-item-anim group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full opacity-0 translate-y-8"
                >
                  <div className="h-56 overflow-hidden relative flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {item.category || "Event"}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-medium">
                      <Calendar size={14} />
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                      {item.description}
                    </p>
                    <span className="text-orange-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Baca Selengkapnya <ChevronRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-20 animate-fade-in">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Tidak ditemukan
              </h3>
              <p className="text-gray-500">Coba kata kunci lain.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
