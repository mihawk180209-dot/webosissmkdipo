import { useEffect, useLayoutEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import MembersGallery from "../components/MembersGallery";
import Footer from "../components/Footer";
import gsap from "gsap";

export default function AllMembers() {
  const comp = useRef(null); // Ref untuk scope animasi

  // Scroll ke atas saat halaman dimuat
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // === GSAP ANIMATION ===
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Judul Utama (Slide Up)
      tl.from(".page-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
      })
        // 2. Garis Bawah (Melebar)
        .from(
          ".page-line",
          {
            width: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        ) // Mulai sedikit lebih awal sebelum judul selesai
        // 3. Subtitle (Fade In)
        .from(
          ".page-subtitle",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6",
        )
        // 4. Gallery Container (Slide Up Pelan)
        .from(
          ".gallery-wrapper",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            clearProps: "all", // Bersihkan agar tidak mengganggu layout
          },
          "-=0.4",
        );
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp}>
      <Navbar />

      <div className="min-h-screen bg-white pb-20">
        {/* === HERO SECTION CLEAN & MINIMALIST === */}
        {/* Background Putih dengan Pattern halus biar gak sepi */}
        <div className="relative pt-32 pb-10 bg-white text-gray-900 mb-8 border-b border-gray-100">
          {/* Hiasan Pattern Dot Halus */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Judul Utama: Hitam Tegas */}
            <h1 className="page-title text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
              Semua Anggota <span className="text-orange-600">OSIS</span>
            </h1>

            {/* Garis Bawah Oranye */}
            {/* Kita set width awal via class w-20 (80px) di CSS, tapi di-override animasi dari 0 */}
            <div className="page-line h-1.5 bg-orange-500 mx-auto rounded-full mb-6 w-20"></div>

            {/* Subtitle Abu-abu */}
            <p className="page-subtitle text-lg text-gray-500 max-w-xl mx-auto">
              Struktur organisasi dan pengurus SMK Diponegoro 1 Jakarta{" "}
              <br className="hidden md:block" /> Periode 2025/2026.
            </p>
          </div>
        </div>

        {/* === GALLERY SECTION === */}
        <div className="gallery-wrapper">
          {/* Gallery ditampilkan langsung di bawahnya */}
          {/* isPreview=false artinya menampilkan SEMUA anggota */}
          <MembersGallery isPreview={false} title="" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
