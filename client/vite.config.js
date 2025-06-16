import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      registerType: 'autoUpdate',
      manifest: {
        name: 'TekRiders E-Learning',
        short_name: 'TekRiders',
        description: 'Progressive Web App for E-Learning',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        charset: false,
        api: 'modern'
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://192.168.1.66:3000',
    }
  },
  define: {
    global: 'window'
  },
  optimizeDeps: {
    include: [
      'pouchdb-browser',
      'pouchdb-find',
      'buffer',
      'process',
      'events',
      'util',
      'stream',
      'path',
      'url'
    ],
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  }
})
