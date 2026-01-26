import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import logo OSIS
import logoOsis from "../assets/logoosis.png";

// Register plugin GSAP
gsap.registerPlugin(ScrollTrigger);

export default function ProgramKerja() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref untuk scope animasi
  const containerRef = useRef(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else {
      setPrograms(data || []);
    }
    setLoading(false); // Tandai loading selesai
  };

  // === GSAP ANIMATION ===
  useLayoutEffect(() => {
    // Jangan jalankan animasi jika masih loading atau data kosong
    if (loading || !containerRef.current) return;

    // Refresh layout agar ScrollTrigger tahu posisi elemen yang baru dimuat
    ScrollTrigger.refresh();

    let ctx = gsap.context(() => {
      // 1. Animasi Header (Judul & Garis)
      gsap.from(".program-header", {
        scrollTrigger: {
          trigger: ".program-header",
          start: "top 85%", // Mulai saat elemen masuk 85% viewport
        },
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // 2. Animasi Kartu (Muncul Berurutan / Stagger)
      if (programs.length > 0) {
        gsap.from(".program-card", {
          scrollTrigger: {
            trigger: ".program-grid", // Trigger pada container gridnya
            start: "top 80%",
          },
          y: 50, // Muncul dari bawah
          opacity: 0,
          duration: 0.6,
          stagger: 0.1, // Jeda 0.1 detik antar kartu
          ease: "back.out(1.2)", // Sedikit efek membal
          clearProps: "all", // Bersihkan style setelah animasi agar hover CSS tetap jalan
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, programs.length]); // Jalankan ulang saat loading selesai

  return (
    <section ref={containerRef} id="program" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="program-header text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Program Kerja
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="animate-spin mb-2 text-orange-500" size={32} />
            <p>Memuat Program Kerja...</p>
          </div>
        ) : (
          /* Grid Card */
          <div className="program-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.length > 0 ? (
              programs.map((program) => (
                <div
                  key={program.id}
                  className="program-card bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
                >
                  {/* === KOTAK LOGO === */}
                  <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 border border-orange-100 p-1 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={logoOsis}
                      alt="Logo OSIS"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Judul Program */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {program.title}
                  </h3>

                  {/* Deskripsi */}
                  <p className="text-gray-500 mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  {/* Link */}
                  <Link
                    to={`/program/${program.id}`}
                    className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                  >
                    Lihat Detail
                    <ArrowRight
                      size={16}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                Belum ada program kerja yang ditambahkan.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
