import 'dotenv/config.js';

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      const INNER_WIDTH = 40;
      const getVisualWidth = (str) => {
        let width = 0;
        for (const char of str) {
          const code = char.codePointAt(0);
          width += (code > 0xffff || (code >= 0x1f300 && code <= 0x1f9ff)) ? 2 : 1;
        }
        return width;
      };

      const line = (str = '') => {
        const visWidth = getVisualWidth(str);
        const pad = Math.max(0, INNER_WIDTH - visWidth);
        return `  ║ ${str}${' '.repeat(pad)} ║`;
      };

      console.log('\n' + [
        `  ╔${'═'.repeat(INNER_WIDTH + 2)}╗`,
        line(''),
        line('  🚗  LUXORIA API Server'),
        line(''),
        line(`  Port: ${PORT}`),
        line(`  Mode: ${process.env.NODE_ENV || 'development'}`),
        line(''),
        `  ╚${'═'.repeat(INNER_WIDTH + 2)}╝`
      ].join('\n') + '\n');
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

startServer();
