import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ChevronRight } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Animasi Background (Bernafas / Zoom In-Out Pelan)
      gsap.to(".hero-bg-image", {
        scale: 1.1,
        duration: 20,
        repeat: -1,
        yoyo: true, // Efek bolak-balik (Zoom in -> Zoom out)
        ease: "sine.inOut", // Sangat halus seperti bernafas
      });

      // 2. Timeline Konten (Muncul Berurutan)
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(".hero-badge", { y: -30, opacity: 0 })
        .from(".hero-title", { y: 30, opacity: 0 }, "-=0.6") // Muncul 0.6 detik sebelum badge selesai
        .from(".hero-desc", { y: 30, opacity: 0 }, "-=0.7")
        .from(".hero-btn", { y: 20, opacity: 0 }, "-=0.7");

      // 3. Animasi Scroll Indicator (Bouncing)
      gsap.to(".scroll-arrow", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={comp}
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* === 1. BACKGROUND DENGAN EFEK ZOOM PELAN (GSAP) === */}
      <div
        className="hero-bg-image absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* Overlay Gradient (Lebih Gelap & Dramatis) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-orange-900/90 z-0"></div>

      {/* Pattern Dot (Tekstur Modern) */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>

      {/* === 2. KONTEN UTAMA === */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge Kecil di Atas */}
        <div className="hero-badge inline-block mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-orange-300 text-sm font-medium tracking-wider uppercase">
          OSIS SMK DIPO 1 JKT
        </div>

        {/* Judul Utama */}
        <h1 className="hero-title text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Organisasi Siswa Intra <br className="hidden md:block" />
          Sekolah{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
            SMK DIPO 1
          </span>
        </h1>

        {/* Deskripsi */}
        <p className="hero-desc text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Wadah aspirasi siswa untuk mewujudkan generasi pemimpin yang
          <span className="text-white font-semibold"> Berkarakter</span>,
          <span className="text-white font-semibold"> Berkarya</span>, dan
          <span className="text-white font-semibold"> Berteknologi</span>.
        </p>

        {/* Tombol Action */}
        <div className="hero-btn flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#tentang"
            className="group px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2"
          >
            Jelajahi Kami
            <ChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>

          <a
            href="#program"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-sm border border-white/10 transition-all"
          >
            Lihat Program Kerja
          </a>
        </div>
      </div>

      {/* === 3. SCROLL INDICATOR (Panah Mantul) === */}
      {/* Saya aktifkan kembali agar terlihat pro */}
      <div className="scroll-arrow absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest">Scroll Down</span>
          <ArrowDown size={24} />
        </div>
      </div>
    </div>
  );
}
