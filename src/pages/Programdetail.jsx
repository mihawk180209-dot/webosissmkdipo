import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgramDetail() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll ke atas saat halaman dibuka
    window.scrollTo(0, 0);

    const fetchDetail = async () => {
      const { data } = await supabase
        .from("programs")
        .select("*")
        .eq("id", id)
        .single();

      setProgram(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  // Format Tanggal (Contoh: 24 Januari 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 size={40} className="text-orange-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Memuat Program...</p>
      </div>
    );
  }

  // Jika data tidak ditemukan
  if (!program)
    return <div className="text-center py-20">Program tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* 1. TOMBOL KEMBALI KE BERANDA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:shadow-md"
            >
              <ArrowLeft size={18} />
              Kembali ke Beranda
            </Link>
          </motion.div>

          {/* MAIN CONTENT CARD */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            {/* 2. HERO IMAGE */}
            <div className="w-full h-64 md:h-[400px] relative bg-gray-200">
              {program.image_url ? (
                <img
                  src={program.image_url}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                // Fallback pattern jika tidak ada gambar
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold opacity-30">
                    OSIS DIPO
                  </span>
                </div>
              )}
              {/* Overlay Gradient Halus di bawah gambar */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            </div>

            {/* 3. CONTENT BODY */}
            <div className="p-6 md:p-10">
              {/* Metadata (Tanggal) */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-orange-500" />
                  <span>{formatDate(program.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-orange-500" />
                  <span>Program Kerja</span>
                </div>
              </div>

              {/* Judul Besar */}
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                {program.title}
              </h1>

              {/* Isi Artikel (Prose) */}
              {/* whitespace-pre-line menjaga paragraf tetap rapi sesuai input */}
              <div className="prose prose-lg prose-orange max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                {program.content || program.description}
              </div>
            </div>
          </motion.article>
        </div>
      </div>

      <Footer />
    </>
  );
}
