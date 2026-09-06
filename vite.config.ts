import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { classifyWasteImageWithGemini } from './src/server/geminiClassifier';
import { fetchGroundedWeatherForLocation } from './src/server/geminiWeather';
import { sendHttpSmsMessage, getSmsLedger, getHttpSmsGatewayStatus } from './src/server/httpSmsService';

function wasteApiPlugin(): Plugin {
  return {
    name: 'waste-classification-api',
    configureServer(server) {
      // Endpoint for httpSMS message dispatch (https://httpsms.com)
      server.middlewares.use('/api/sms/send', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { to, content, type, metadata } = JSON.parse(body || '{}');
            if (!to || !content) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Missing "to" (phone number) or "content" (message body).' }));
              return;
            }

            const result = await sendHttpSmsMessage({
              to,
              content,
              type: type || 'SYSTEM',
              metadata
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('Vite middleware /api/sms/send error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || 'Failed to dispatch SMS' }));
          }
        });
      });

      // Endpoint for httpSMS gateway status
      server.middlewares.use('/api/sms/status', (req, res, next) => {
        if (req.method !== 'GET') return next();
        const status = getHttpSmsGatewayStatus();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, ...status }));
      });

      // Endpoint for httpSMS logs ledger
      server.middlewares.use('/api/sms/logs', (req, res, next) => {
        if (req.method !== 'GET') return next();
        const logs = getSmsLedger();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, logs }));
      });

      // Endpoint for AI Waste Classification
      server.middlewares.use('/api/classify-waste', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { image, hint } = JSON.parse(body || '{}');
            if (!image) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing image data' }));
              return;
            }

            const result = await classifyWasteImageWithGemini(image, hint);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: !!result, data: result }));
          } catch (err: any) {
            console.error('API /api/classify-waste handler error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
          }
        });
      });

      // Endpoint for Google Search Grounded Real-Time Local Weather & Waste Collection Advisor
      server.middlewares.use('/api/weather-grounding', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { location, latitude, longitude } = JSON.parse(body || '{}');
            const result = await fetchGroundedWeatherForLocation(location || 'Accra, Ghana', latitude, longitude);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, data: result }));
          } catch (err: any) {
            console.error('API /api/weather-grounding handler error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || 'Weather fetch failed' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), wasteApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
