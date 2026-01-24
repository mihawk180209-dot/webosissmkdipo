import { useEffect } from "react";
import Navbar from "../components/Navbar";
import MembersGallery from "../components/MembersGallery";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function AllMembers() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white pb-20">
        {/* === HERO SECTION CLEAN & MINIMALIST === */}
        {/* Background Putih dengan Pattern halus biar gak sepi */}
        <div className="relative pt-32 pb-10 bg-white text-gray-900 mb-8 border-b border-gray-100">
          {/* Hiasan Pattern Dot Halus */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Judul Utama: Hitam Tegas */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900"
            >
              Semua Anggota <span className="text-orange-600">OSIS</span>
            </motion.h1>

            {/* Garis Bawah Oranye */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-1.5 bg-orange-500 mx-auto rounded-full mb-6"
            ></motion.div>

            {/* Subtitle Abu-abu */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-500 max-w-xl mx-auto"
            >
              Struktur organisasi dan pengurus SMK Diponegoro 1 Jakarta{" "}
              <br className="hidden md:block" /> Periode 2025/2026.
            </motion.p>
          </div>
        </div>

        {/* === GALLERY SECTION === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Gallery ditampilkan langsung di bawahnya */}
          <MembersGallery isPreview={false} title="" />
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
