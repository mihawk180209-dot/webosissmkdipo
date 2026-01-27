import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import obfuscator from "rollup-plugin-obfuscator";
import viteCompression from "vite-plugin-compression"; // Plugin kompresi

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // 1. KOMPRESI (Bikin file jadi super kecil .br)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240, // Hanya kompres file > 10kb
      deleteOriginFile: false,
    }),

    // 2. OBFUSCATOR (Mode Aman & Ringan)
    obfuscator({
      apply: "build",
      options: {
        compact: true,
        controlFlowFlattening: false, // OFF biar ringan
        deadCodeInjection: false, // OFF biar file gak bengkak
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: "hexadecimal",
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: false,
        shuffleStringArray: true,
        splitStrings: false, // OFF biar file gak bengkak
        stringArray: true,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false,
      },
    }),
  ],

  // 3. BUILD OPTIMIZATION
  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false, // Hemat size
    chunkSizeWarningLimit: 1000,

    // 4. SMART CHUNKING (Pemisahan File)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Pisahin Core React
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-react";
            }
            // Pisahin Supabase
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            // Pisahin Framer Motion (Berat, wajib pisah)
            if (id.includes("framer-motion")) {
              return "vendor-framer";
            }
            // Pisahin GSAP
            if (id.includes("gsap")) {
              return "vendor-gsap";
            }
            // Pisahin Image Zoom
            if (id.includes("react-medium-image-zoom")) {
              return "vendor-img-zoom";
            }
            // Sisanya
            return "vendor-utils";
          }
        },
      },
    },
  },
});
