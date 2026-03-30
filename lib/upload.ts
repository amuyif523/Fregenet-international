import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { getUploadEnv, isProduction } from '@/lib/env';

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const REPORT_FILE_MAX_SIZE = 15 * 1024 * 1024;

function resolveUploadTarget(subDir: string): { dirPath: string; publicUrlPrefix: string } {
  const { uploadsDir, uploadsPublicBaseUrl } = getUploadEnv();

  if (uploadsDir && uploadsPublicBaseUrl) {
    return {
      dirPath: path.join(uploadsDir, subDir),
      publicUrlPrefix: `${uploadsPublicBaseUrl.replace(/\/$/, '')}/${subDir}`,
    };
  }

  if (isProduction()) {
    throw new Error('Uploads are not configured for production. Set UPLOADS_DIR and UPLOADS_PUBLIC_BASE_URL.');
  }

  return {
    dirPath: path.join(process.cwd(), 'public', subDir),
    publicUrlPrefix: `/${subDir}`,
  };
}

function validatePdfFile(file: File): void {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are accepted.');
  }

  if (file.size <= 0) {
    throw new Error('Please upload a non-empty PDF file.');
  }

  if (file.size > REPORT_FILE_MAX_SIZE) {
    throw new Error('PDF size must be 15MB or less.');
  }
}

export async function saveReportFile(file: File): Promise<string> {
  validatePdfFile(file);

  const { dirPath: reportsDir, publicUrlPrefix } = resolveUploadTarget('reports');
  await mkdir(reportsDir, { recursive: true });

  const safeOriginalName = sanitizeFileName(file.name || 'report.pdf') || 'report.pdf';
  const timestamp = Date.now();
  const fileName = `${timestamp}-${safeOriginalName}`;
  const filePath = path.join(reportsDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `${publicUrlPrefix}/${fileName}`;
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

  const { dirPath: boardDir, publicUrlPrefix } = resolveUploadTarget('images/board');
  await mkdir(boardDir, { recursive: true });

  const extension = boardImageMimeToExt[file.type];
  const timestamp = Date.now();
  const baseName = slugifyFilePart(memberName);
  const fileName = `${baseName}-${timestamp}.${extension}`;
  const filePath = path.join(boardDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `${publicUrlPrefix}/${fileName}`;
}

export async function saveNewsletterCoverImage(file: File, title: string): Promise<string> {
  const validation = validateBoardImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const { dirPath: newsletterDir, publicUrlPrefix } = resolveUploadTarget('images/newsletters');
  await mkdir(newsletterDir, { recursive: true });

  const extension = boardImageMimeToExt[file.type];
  const timestamp = Date.now();
  const baseName = slugifyFilePart(title || 'newsletter-cover');
  const fileName = `${baseName}-${timestamp}.${extension}`;
  const filePath = path.join(newsletterDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `${publicUrlPrefix}/${fileName}`;
}

export async function saveProjectImage(file: File, projectTitle: string): Promise<string> {
  const validation = validateBoardImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const { dirPath: projectsDir, publicUrlPrefix } = resolveUploadTarget('images/projects');
  await mkdir(projectsDir, { recursive: true });

  const extension = boardImageMimeToExt[file.type];
  const timestamp = Date.now();
  const baseName = slugifyFilePart(projectTitle || 'project-image');
  const fileName = `${baseName}-${timestamp}.${extension}`;
  const filePath = path.join(projectsDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `${publicUrlPrefix}/${fileName}`;
}
