/**
 * HahuCloud / LiteSpeed Production Entry Point
 * 
 * This file acts as a bridge to the Next.js standalone server.
 * It is required because LiteSpeed (lsnode) explicitly looks for a server.js
 * file in the application root, but cannot execute 'next start' directly.
 */

process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || 3000;

// Log startup for Passenger/LiteSpeed debugging
console.log(`Starting production server on port ${process.env.PORT}...`);

// Import the standalone server entry point
// Next.js standalone output bundles all dependencies into .next/standalone
import('./.next/standalone/server.js');
