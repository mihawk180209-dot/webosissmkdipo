import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, ChevronLeft, Tag, Clock } from "lucide-react";

export default function DetailKegiatan() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getDetail() {
      const { data } = await supabase
        .from("kegiatan")
        .select("*")
        .eq("id", id)
        .single();
      setData(data);
    }
    getDetail();
  }, [id]);

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 font-medium mb-8 hover:text-orange-600 hover:-translate-x-1 transition-all"
          >
            <ChevronLeft size={20} /> Kembali ke Beranda
          </Link>

          <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-[400px] w-full relative">
              <img
                src={data.image_url}
                className="w-full h-full object-cover"
                alt={data.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                  {data.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  {data.title}
                </h1>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-6 border-b border-gray-100 pb-8 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Calendar size={20} />
                  </div>
                  <span className="font-medium">
                    {new Date(data.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="prose prose-lg prose-orange max-w-none text-gray-600 leading-loose whitespace-pre-line">
                {data.content}
              </div>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}
