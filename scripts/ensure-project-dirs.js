#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

// List of directories to ensure exist for file uploads and assets
const directories = [
  path.join(process.cwd(), 'public', 'images', 'projects'),
  path.join(process.cwd(), 'public', 'images', 'board'),
  path.join(process.cwd(), 'public', 'images', 'newsletters'),
  path.join(process.cwd(), 'public', 'uploads'),
  path.join(process.cwd(), 'public', 'uploads', 'newsletters'),
  path.join(process.cwd(), 'public', 'uploads', 'reports'),
];

// Create all directories recursively
directories.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`✓ Ensured directory exists: ${path.relative(process.cwd(), dir)}`);
});

console.log('\n✓ All upload and asset directories are ready.');
