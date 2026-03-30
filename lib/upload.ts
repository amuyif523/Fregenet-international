import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function saveReportFile(file: File): Promise<string> {
  const reportsDir = path.join(process.cwd(), 'public', 'reports');
  await mkdir(reportsDir, { recursive: true });

  const safeOriginalName = sanitizeFileName(file.name || 'report.pdf') || 'report.pdf';
  const timestamp = Date.now();
  const fileName = `${timestamp}-${safeOriginalName}`;
  const filePath = path.join(reportsDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/reports/${fileName}`;
}

const BOARD_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const boardImageMimeToExt: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function slugifyFilePart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'member';
}

export function validateBoardImageFile(file: File): { valid: true } | { valid: false; message: string } {
  const extension = boardImageMimeToExt[file.type];
  if (!extension) {
    return { valid: false, message: 'Only JPG, PNG, and WEBP images are allowed.' };
  }

  if (file.size <= 0) {
    return { valid: false, message: 'Please upload a non-empty image file.' };
  }

  if (file.size > BOARD_IMAGE_MAX_SIZE) {
    return { valid: false, message: 'Image size must be 5MB or less.' };
  }

  return { valid: true };
}

export async function saveBoardImage(file: File, memberName: string): Promise<string> {
  const validation = validateBoardImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const boardDir = path.join(process.cwd(), 'public', 'images', 'board');
  await mkdir(boardDir, { recursive: true });

  const extension = boardImageMimeToExt[file.type];
  const timestamp = Date.now();
  const baseName = slugifyFilePart(memberName);
  const fileName = `${baseName}-${timestamp}.${extension}`;
  const filePath = path.join(boardDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/images/board/${fileName}`;
}

export async function saveNewsletterCoverImage(file: File, title: string): Promise<string> {
  const validation = validateBoardImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const newsletterDir = path.join(process.cwd(), 'public', 'images', 'newsletters');
  await mkdir(newsletterDir, { recursive: true });

  const extension = boardImageMimeToExt[file.type];
  const timestamp = Date.now();
  const baseName = slugifyFilePart(title || 'newsletter-cover');
  const fileName = `${baseName}-${timestamp}.${extension}`;
  const filePath = path.join(newsletterDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/images/newsletters/${fileName}`;
}

export async function saveProjectImage(file: File, projectTitle: string): Promise<string> {
  const validation = validateBoardImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const projectsDir = path.join(process.cwd(), 'public', 'images', 'projects');
  await mkdir(projectsDir, { recursive: true });

  const extension = boardImageMimeToExt[file.type];
  const timestamp = Date.now();
  const baseName = slugifyFilePart(projectTitle || 'project-image');
  const fileName = `${baseName}-${timestamp}.${extension}`;
  const filePath = path.join(projectsDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/images/projects/${fileName}`;
}
