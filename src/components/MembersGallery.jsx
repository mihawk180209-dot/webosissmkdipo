import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function MembersGallery({ isPreview = false, title = "" }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    let query = supabase
      .from("members")
      .select("*")
      .order("id", { ascending: true }); // Mengurutkan berdasarkan ID

    if (isPreview) {
      query = query.limit(4); // Limit 4 orang untuk Homepage
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching members:", error);
    else setMembers(data);
  };

  // Logic Judul:
  // 1. Jika ada props 'title', pakai itu.
  // 2. Jika tidak ada props 'title' TAPI ini mode preview (Home), pakai "Pengurus OSIS".
  // 3. Jika tidak keduanya, kosongkan (karena sudah ada Hero Section di AllMembers).
  const displayTitle = title || (isPreview ? "Pengurus OSIS" : "");

  return (
    <section id="anggota" className={isPreview ? "py-20 bg-orange-50" : "py-0"}>
      <div className="container mx-auto px-4">
        {/* JUDUL (Hanya muncul jika displayTitle ada isinya) */}
        {displayTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {displayTitle}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
        )}

        {/* === PERBAIKAN LAYOUT === */}
        {/* Menggunakan GRID agar urutan Kiri-Kanan dan Tinggi Sejajar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
            >
              {/* IMAGE CONTAINER */}
              {/* aspect-[3/4] memaksa semua kotak foto ukurannya sama persis (Portrait) */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay Gradient Hitam di bawah foto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* TEXT CONTAINER */}
              <div className="p-5 flex flex-col justify-end flex-grow relative">
                {/* Garis hiasan kecil */}
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

        {/* TOMBOL LIHAT SEMUA (Hanya di Homepage) */}
        {isPreview && (
          <div className="text-center mt-12">
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
