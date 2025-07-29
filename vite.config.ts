import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      srcDir: 'src',
      filename: 'sw.ts',
      workbox: {
          swDest: "sw.js",
      },
      strategies: 'injectManifest', // default
      injectRegister: 'script-defer',
      includeAssets: [ /* "favicon.ico",*/ ],
      manifest: {
        short_name: "Occupancies",
        name: "Ariel.Care Occupancy Map",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#f2f2f2",
        description: "A dashboard for the Ariel.Care room occupancies.",
        // name: "Name of your app",
        // ...
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "apple-touch-icon-60x60.png",
            sizes: "60x60",
            type: "image/png"
          },
          {
            src: "apple-touch-icon-76x76.png",
            sizes: "76x76",
            type: "image/png"
          },
          {
            src: "apple-touch-icon-120x120.png",
            sizes: "120x120",
            type: "image/png"
          },
          {
            src: "apple-touch-icon-152x152.png",
            sizes: "152x152",
            type: "image/png"
          },
          {
            src: "apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png"
          },
          {
            src: "apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png"
          },
          {
            src: "favicon-16x16.png",
            sizes: "16x16",
            type: "image/png"
          },
          {
            src: "favicon-32x32.png",
            sizes: "32x32",
            type: "image/png"
          },
          {
            src: "msapplication-icon-144x144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "mstile-150x150.png",
            sizes: "150x150",
            type: "image/png"
          }
        ]
      },
  }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
