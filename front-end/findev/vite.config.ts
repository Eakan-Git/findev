import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sassDts from "vite-plugin-sass-dts";
import { resolve } from "path";
import Icons from "unplugin-icons/vite";
import autoprefixer from "autoprefixer";
import checker from "vite-plugin-checker";


const vendor = ["react", "react-router-dom", "react-dom"];
function renderChunks(deps: unknown) {
  const chunks = {};
  Object.keys(deps).forEach(key => {
    if (vendor.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    hmr: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles" as *;`,
        importer() {
          return {
            file: `${resolve(__dirname, "./src/styles")}`,
          };
        },
      },
    },
  },
  plugins: [
    sassDts({
      enabledMode: ["development"],
    }),
    react({
      include: ["**/*.tsx", "**/*.ts"],
    }),
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint --fix --ext .ts,.tsx ./src --ignore-path .gitignore",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      styles: resolve(__dirname, "./src/styles"),
    },
  },
});
