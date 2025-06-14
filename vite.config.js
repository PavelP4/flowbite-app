import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    solidPlugin(),
    basicSsl({
      /** name of certification */ name: 'proxyman.debug:',
      /** custom trust domains */
      domains: ['proxyman.debug'],
      /** custom certification directory */
      certDir: './cert',
    })
  ],
  server: {
    host: 'proxyman.debug',
    port: 3000,    
    proxy: {
      '/api': {
        target: 'http://proxyman.debug:5058',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        },
      },
      '/swagger': {
        target: 'http://proxyman.debug:5058',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        },
      },
      '/login': {
        target: 'https://proxyman.debug:5059',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      '/logout': {
        target: 'https://proxyman.debug:5059',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        },
      },
      '/callback': {
        target: 'https://proxyman.debug:5059',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        },
      },
    }
  },
  build: {
    target: 'esnext',
  },
});
