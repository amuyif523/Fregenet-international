#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'public', 'images', 'projects');

fs.mkdirSync(targetDir, { recursive: true });
console.log(`Ensured project image directory exists: ${targetDir}`);
