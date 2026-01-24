import { motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <div
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* === 1. BACKGROUND DENGAN EFEK ZOOM PELAN === */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }} // Efek bernafas (zoom in out pelan)
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
      </motion.div>

      {/* Overlay Gradient (Lebih Gelap & Dramatis) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-orange-900/90 z-0"></div>

      {/* Pattern Dot (Tekstur Modern) */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>

      {/* === 2. KONTEN UTAMA === */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge Kecil di Atas */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-orange-300 text-sm font-medium tracking-wider uppercase"
        >
          OSIS SMK DIPO 1 JKT
        </motion.div>

        {/* Judul Utama */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight"
        >
          Organisasi Siswa Intra <br className="hidden md:block" />
          Sekolah{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
            SMK DIPO 1
          </span>
        </motion.h1>

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Wadah aspirasi siswa untuk mewujudkan generasi pemimpin yang
          <span className="text-white font-semibold"> Berkarakter</span>,
          <span className="text-white font-semibold"> Berkarya</span>, dan
          <span className="text-white font-semibold"> Berteknelogi</span>.
        </motion.p>

        {/* Tombol Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
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
        </motion.div>
      </div>

      {/* === 3. SCROLL INDICATOR (Panah Mantul) === */}
      <motion.div
      // className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
      // animate={{ y: [0, 10, 0] }}
      // transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest">Scroll Down</span>
          <ArrowDown size={24} />
        </div> */}
      </motion.div>
    </div>
  );
}
