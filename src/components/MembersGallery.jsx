import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrasi plugin
gsap.registerPlugin(ScrollTrigger);

export default function MembersGallery({ isPreview = false, title = "" }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref untuk scoping GSAP agar tidak "bocor" ke komponen lain
  const containerRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
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

  const displayTitle = title || (isPreview ? "Struktur Organisasi" : "");
  const studentSubtitle = isPreview
    ? "Badan Pengurus Harian"
    : "Pengurus Siswa";

  // --- GSAP ANIMATION SETUP ---
  useLayoutEffect(() => {
    if (loading) return;

    let ctx = gsap.context(() => {
      // PERBAIKAN: Cek dulu apakah .anim-header ada sebelum di-animasi
      // Kita gunakan containerRef.current.querySelector untuk mencari di dalam scope
      if (containerRef.current.querySelector(".anim-header")) {
        gsap.from(".anim-header", {
          y: -30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".anim-header",
            start: "top 85%",
          },
        });
      }

      // 2. Animasi Divider & Section Guru
      if (teachers.length > 0) {
        // Cek juga untuk divider teacher
        if (containerRef.current.querySelector(".anim-divider-teacher")) {
          gsap.from(".anim-divider-teacher", {
            scaleX: 0,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".teacher-section", start: "top 80%" },
          });
        }

        gsap.from(".teacher-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: ".teacher-section", start: "top 75%" },
        });
      }

      // 3. Animasi Divider & Section Siswa
      // Cek divider student
      if (containerRef.current.querySelector(".anim-divider-student")) {
        gsap.from(".anim-divider-student", {
          scaleX: 0,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".student-grid", start: "top 85%" },
        });
      }

      gsap.from(".student-card", {
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".student-grid", start: "top 80%" },
      });

      // 4. Animasi Tombol Lihat Semua
      if (isPreview) {
        gsap.from(".anim-btn", {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: ".anim-btn", start: "top 90%" },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, teachers, students, isPreview]);
  // --- INTERACTION ANIMATIONS (HOVER) ---
  // Fungsi ini menggantikan CSS hover classes
  const onHoverTeacher = (e, enter) => {
    const card = e.currentTarget;
    const img = card.querySelector("img");

    gsap.to(card, {
      scale: enter ? 1.05 : 1,
      duration: 0.4,
      ease: "power2.out",
    });
    // Efek scale gambar guru
    gsap.to(img, {
      scale: enter ? 1.1 : 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const onHoverStudent = (e, enter) => {
    const card = e.currentTarget;
    const img = card.querySelector("img");
    const overlay = card.querySelector(".overlay-gradient");

    gsap.to(card, {
      y: enter ? -8 : 0, // Menggantikan -translate-y-1
      boxShadow: enter
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(img, {
      scale: enter ? 1.1 : 1, // Menggantikan group-hover:scale-110
      duration: 0.5,
      ease: "power1.out",
    });

    // Sedikit menggelapkan overlay saat hover
    gsap.to(overlay, {
      opacity: enter ? 0.8 : 0.6,
      duration: 0.3,
    });
  };

  const onHoverBtn = (e, enter) => {
    gsap.to(e.currentTarget, {
      backgroundColor: enter ? "#f97316" : "#ffffff", // orange-500 : white
      color: enter ? "#ffffff" : "#ea580c", // white : orange-600
      scale: enter ? 1.05 : 1,
      boxShadow: enter ? "0 4px 6px -1px rgba(249, 115, 22, 0.4)" : "none",
      duration: 0.3,
    });
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Memuat data...</div>
    );

  return (
    <section
      id="anggota"
      ref={containerRef}
      className={isPreview ? "py-20 bg-orange-50" : "py-0"}
    >
      <div className="container mx-auto px-4">
        {/* JUDUL UTAMA BESAR */}
        {displayTitle && (
          <div className="anim-header text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {displayTitle}
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
        )}

        {/* === BAGIAN 1: DEWAN GURU / PEMBINA === */}
        {teachers.length > 0 && (
          <div className="teacher-section mb-16">
            {/* JUDUL PEMBATAS PEMBINA */}
            <div className="anim-divider-teacher flex items-center gap-4 mb-10">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h3 className="text-center text-xl font-bold text-gray-500 uppercase tracking-[0.2em]">
                Dewan Pembina
              </h3>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-10 md:gap-16">
              {teachers.map((guru) => (
                <div
                  key={guru.id}
                  className="teacher-card text-center w-64 cursor-pointer" // Removed 'group' and css transitions
                  onMouseEnter={(e) => onHoverTeacher(e, true)}
                  onMouseLeave={(e) => onHoverTeacher(e, false)}
                >
                  {/* FOTO GURU */}
                  {/* Removed transition classes, added overflow-hidden for image zoom containment */}
                  <div className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-6 rounded-full p-2 bg-white border border-gray-100 shadow-xl relative overflow-hidden">
                    <img
                      src={guru.image_url}
                      alt={guru.name}
                      className="w-full h-full object-cover rounded-full" // Removed CSS transition/transform classes
                    />
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
          {/* JUDUL PEMBATAS SISWA */}
          {teachers.length > 0 && (
            <div className="anim-divider-student flex items-center gap-4 mb-10 mt-10">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h3 className="text-center text-xl font-bold text-gray-500 uppercase tracking-[0.2em]">
                {studentSubtitle}
              </h3>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
          )}

          <div className="student-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {students.map((member) => (
              <div
                key={member.id}
                // Removed CSS hover/transition classes
                className="student-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer"
                onMouseEnter={(e) => onHoverStudent(e, true)}
                onMouseLeave={(e) => onHoverStudent(e, false)}
              >
                {/* FOTO SISWA */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover" // Removed CSS transition classes
                  />
                  {/* Overlay gradient di-target via class untuk animasi opacity */}
                  <div className="overlay-gradient absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
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

        {/* TOMBOL LIHAT SEMUA */}
        {isPreview && (
          <div className="text-center mt-16">
            <Link
              to="/members"
              className="anim-btn inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-full shadow-sm" // Removed CSS hover classes
              onMouseEnter={(e) => onHoverBtn(e, true)}
              onMouseLeave={(e) => onHoverBtn(e, false)}
            >
              Lihat Semua Anggota
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
