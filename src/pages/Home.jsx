import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MembersGallery from "../components/MembersGallery";
import ProgramKerja from "../components/ProgramKerja";
import Footer from "../components/Footer";
import Kegiatan from "../components/Kegiatan"; // Pastikan file ini ada di components
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, CheckCircle, Users, Sparkles, Loader2 } from "lucide-react";
import dipo from "../assets/diponibos.jpg";

gsap.registerPlugin(ScrollTrigger);

// === COMPONENT ABOUT ===
const AboutSection = () => {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".about-content", {
        scrollTrigger: { trigger: ".about-content", start: "top 80%" },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".about-image", {
        scrollTrigger: { trigger: ".about-image", start: "top 80%" },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2,
      });
      gsap.to(".bg-blob-1", {
        y: 50,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={comp}
      id="tentang"
      className="py-24 bg-white overflow-hidden relative"
    >
      <div className="bg-blob-1 absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="about-content">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-orange-500" size={24} />
              <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">
                Tentang Kami
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Wadah Aspirasi & <br />
              <span className="text-orange-500">Kreativitas Siswa</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              OSIS SMK Diponegoro 1 Jakarta hadir bukan hanya sebagai
              organisasi, tapi sebagai rumah bagi ide-ide brilian.
            </p>
            <div className="flex gap-8">
              <div>
                <h4 className="text-3xl font-bold text-gray-800">20+</h4>
                <p className="text-sm text-gray-500">Anggota Aktif</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-gray-800">3+</h4>
                <p className="text-sm text-gray-500">Program Kerja</p>
              </div>
            </div>
          </div>
          <div className="about-image relative">
            <div className="absolute inset-0 bg-orange-500 rounded-3xl rotate-3 opacity-20 transform translate-x-2 translate-y-2"></div>
            <img
              src={dipo}
              alt="Kegiatan OSIS"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[400px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// === COMPONENT VISI MISI ===
const VisiMisiSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const comp = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("school_profile")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      gsap.from(".vm-title", {
        scrollTrigger: { trigger: ".vm-title", start: "top 85%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
      });
      gsap.from(".vm-card", {
        scrollTrigger: { trigger: ".vm-grid", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
      });
    }, comp);
    return () => ctx.revert();
  }, [loading]);

  if (loading)
    return (
      <div className="py-24 bg-gray-900 flex justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
      </div>
    );

  const vision = data?.vision || "Visi belum diisi.";
  const missionList = data?.mission
    ? data.mission.split("\n").filter((i) => i.trim() !== "")
    : ["Misi belum diisi."];

  return (
    <section
      ref={comp}
      id="visi-misi"
      className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="vm-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Visi & Misi</h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>
        <div className="vm-grid grid md:grid-cols-2 gap-8">
          <div className="vm-card bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-orange-400">
              Visi Kami
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed italic">
              "{vision}"
            </p>
          </div>
          <div className="vm-card bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-blue-400">Misi Kami</h3>
            <ul className="space-y-4">
              {missionList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle
                    className="text-green-400 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// === HOME UTAMA ===
export default function Home() {
  return (
    <div className="font-sans overflow-x-hidden">
      <Navbar />
      <Hero />
      <AboutSection />
      <VisiMisiSection />
      <MembersGallery isPreview={true} title="Pengurus Inti" />
      <ProgramKerja />

      {/* SECTION KEGIATAN (Di Bawah Program Kerja) */}
      <Kegiatan />

      <Footer />
    </div>
  );
}
