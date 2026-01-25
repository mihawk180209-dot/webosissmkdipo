import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function MembersGallery({ isPreview = false, title = "" }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    // Ambil data anggota, urutkan berdasarkan ID
    let query = supabase
      .from("members")
      .select("*")
      .order("id", { ascending: true });

    const { data, error } = await query;
    if (error) console.error("Error fetching members:", error);
    else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  // --- LOGIC PEMISAH GURU VS SISWA ---
  const teachers = members.filter(
    (m) =>
      m.position.toLowerCase().includes("pembina") ||
      m.position.toLowerCase().includes("kepala") ||
      m.position.toLowerCase().includes("waka"),
  );

  let students = members.filter(
    (m) =>
      !m.position.toLowerCase().includes("pembina") &&
      !m.position.toLowerCase().includes("kepala") &&
      !m.position.toLowerCase().includes("waka"),
  );

  if (isPreview) {
    students = students.slice(0, 4);
  }

  // Judul Utama Section
  const displayTitle = title || (isPreview ? "Struktur Organisasi" : "");

  // LOGIC JUDUL SUB-SECTION SISWA (Sesuai Request)
  const studentSubtitle = isPreview
    ? "Badan Pengurus Harian"
    : "Pengurus Siswa";

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Memuat data...</div>
    );

  return (
    <section id="anggota" className={isPreview ? "py-20 bg-orange-50" : "py-0"}>
      <div className="container mx-auto px-4">
        {/* JUDUL UTAMA BESAR */}
        {displayTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {displayTitle}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
        )}

        {/* === BAGIAN 1: DEWAN GURU / PEMBINA === */}
        {teachers.length > 0 && (
          <div className="mb-16">
            {/* JUDUL PEMBATAS PEMBINA */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h3 className="text-center text-xl font-bold text-gray-500 uppercase tracking-[0.2em]">
                Dewan Pembina
              </h3>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-10 md:gap-16">
              {teachers.map((guru) => (
                <div key={guru.id} className="text-center group w-64">
                  {/* FOTO GURU (FULL COLOR) */}
                  <div className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-6 rounded-full p-2 bg-white border border-gray-100 shadow-xl group-hover:scale-105 transition-transform duration-500 relative">
                    <img
                      src={guru.image_url}
                      alt={guru.name}
                      className="w-full h-full object-cover rounded-full transition-all duration-500"
                    />
                    <div className="absolute bottom-2 right-4 bg-orange-600 text-white text-xs px-3 py-1 rounded-full shadow-md font-bold">
                      Guru
                    </div>
                  </div>

                  <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                    {guru.name}
                  </h4>
                  <p className="text-orange-600 font-medium text-sm md:text-base uppercase tracking-wider">
                    {guru.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === BAGIAN 2: PENGURUS SISWA === */}
        <div>
          {/* JUDUL PEMBATAS SISWA (DINAMIS SESUAI HALAMAN) */}
          {teachers.length > 0 && (
            <div className="flex items-center gap-4 mb-10 mt-10">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h3 className="text-center text-xl font-bold text-gray-500 uppercase tracking-[0.2em]">
                {studentSubtitle} {/* <--- INI SUDAH DIGANTI VARIABEL */}
              </h3>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {students.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
              >
                {/* FOTO SISWA */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* TEKS SISWA */}
                <div className="p-5 flex flex-col justify-end flex-grow relative">
                  <div className="absolute top-0 left-5 w-8 h-1 bg-orange-500 rounded-b-md"></div>
                  <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 text-sm font-semibold uppercase tracking-wider">
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOMBOL LIHAT SEMUA (Hanya di Homepage) */}
        {isPreview && (
          <div className="text-center mt-16">
            <Link
              to="/members"
              className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              Lihat Semua Anggota
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
