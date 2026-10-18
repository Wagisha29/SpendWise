import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'autoUpdate' = new service worker versions activate automatically
      // in the background on the next page load, no "update available"
      // prompt needed. Simpler UX for a solo/small-team app like this.
      registerType: 'autoUpdate',

      // Run the service worker during `npm run dev` too, so you can test
      // PWA behaviour locally without doing a full build every time.
      devOptions: {
        enabled: true,
      },

      // Extra static files (besides what Vite already bundles) to
      // precache so they're available offline too.
      includeAssets: ['favicon.svg', 'icons.svg'],

      manifest: {
        name: 'SpendWise - Expense Tracker',
        short_name: 'SpendWise',
        description:
          'Track expenses, income, and savings goals with SpendWise.',
        theme_color: '#6366f1',
        background_color: '#f6f5fc',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Cache the Google Fonts used in index.html so the app's
        // typography still loads correctly when offline.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
})
