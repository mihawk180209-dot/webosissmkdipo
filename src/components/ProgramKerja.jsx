import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// Import logo OSIS
import logoOsis from "../assets/logoosis.png";

export default function ProgramKerja() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setPrograms(data);
  };

  return (
    <section id="program" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Program Kerja
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Grid Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* === KOTAK LOGO (SELALU LOGO OSIS) === */}
              {/* Saya kasih padding (p-1) biar logonya gak terlalu mepet pinggir kotak */}
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 border border-orange-100 p-1">
                <img
                  src={logoOsis}
                  alt="Logo OSIS"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Judul Program */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {program.title}
              </h3>

              {/* Deskripsi */}
              <p className="text-gray-500 mb-4 line-clamp-2">
                {program.description}
              </p>

              {/* Link */}
              <Link
                to={`/program/${program.id}`}
                className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700"
              >
                Lihat Detail <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
