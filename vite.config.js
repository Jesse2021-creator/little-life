import { defineConfig, loadEnv } from 'vite';
import { createPaystackHandler } from './server/paystack-api.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const handlePaystack = createPaystackHandler({
    secretKey: env.PAYSTACK_SECRET_KEY,
    appUrl: env.APP_URL || 'http://localhost:5173',
    currency: env.PAYSTACK_CURRENCY || 'USD'
  });

  return {
    base: '/little-life/',

    server: {
      proxy: {}
    },

    plugins: [
      {
        name: 'paystack-marketplace-api',

        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            Promise.resolve(handlePaystack(req, res))
              .then(handled => {
                if (!handled) next();
              })
              .catch(next);
          });
        },
      }
    ]
  };
});