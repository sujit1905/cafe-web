import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const [{ default: app }, { connectDB }, { seedData }] = await Promise.all([
  import('./app.js'),
  import('./config/db.js'),
  import('./utils/seed.js'),
]);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establish MongoDB connection (falls back to in-memory if no MONGODB_URI)
    await connectDB();

    // Seed only when explicitly requested; seedData skips non-empty databases.
    if (process.env.SEED_ON_START === 'true') {
      console.log('[Server] Seeding database with initial data...');
      try {
        await seedData();
      } catch (seedErr) {
        // Don't crash server if seed fails (data may already exist)
        console.warn(`[Server] Seed warning: ${seedErr.message}`);
      }
    }

    // 3. Start Express server listener
    const server = app.listen(PORT, () => {
      console.log(
        `\n╔══════════════════════════════════════════════╗`
      );
      console.log(
        `║  ☕ Brew & Bite Backend is running!          ║`
      );
      console.log(
        `╠══════════════════════════════════════════════╣`
      );
      console.log(
        `║  API:    http://localhost:${PORT}                 ║`
      );
      console.log(
        `║  Docs:   http://localhost:${PORT}/api/docs         ║`
      );
      console.log(
        `║  Health: http://localhost:${PORT}/api/health       ║`
      );
      console.log(
        `╚══════════════════════════════════════════════╝\n`
      );
    });

    // Graceful shutdown handlers
    const shutdown = (signal) => {
      console.log(`\n[Server] ${signal} received. Closing HTTP server...`);
      server.close(() => {
        console.log('[Server] HTTP server closed gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled Promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Server Error] Unhandled Rejection at:', promise, 'reason:', reason);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`[Server Error] Startup failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();
