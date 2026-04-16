#!/usr/bin/env node
// Scans the Hotel Brand Information folder and produces:
//   1. A JS data file (src/data/brandsData.js) for the app
//   2. An upload manifest (scripts/upload-manifest.json) with source->destination paths
//
// Filters out:
//   - Retired documents and zArchive folders
//   - Video files (.mp4, .mov, .avi)
//   - Macro-enabled Excel (.xlsm) - these don't render in browsers
//   - Hidden files and OS junk (.DS_Store, Thumbs.db)
//   - Training Certificates folder (per-user completion docs, not reference)
//   - Hotel LOGOS folder (separate asset use case)
//
// Usage: node scripts/scan-brand-files.mjs

import { readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const SOURCE_ROOT = 'C:/Users/Ryan/Downloads/Hotel Brand Information/HOTEL BRANDS';

// Brand folder -> slug mapping
const BRAND_MAP = {
  'Best Western Tools': { slug: 'best-western', name: 'Best Western', description: 'Best Western Hotels and Resorts reference materials' },
  'Choice Tools':       { slug: 'choice',       name: 'Choice',       description: 'Choice Hotels International reference materials' },
  'Hilton Tool Kit':    { slug: 'hilton',       name: 'Hilton',       description: 'Hilton Worldwide reference materials' },
  'Hyatt Place':        { slug: 'hyatt',        name: 'Hyatt',        description: 'Hyatt Hotels reference materials' },
  'IHG tools':          { slug: 'ihg',          name: 'IHG',          description: 'InterContinental Hotels Group reference materials' },
  'Marriott Tools':     { slug: 'marriott',     name: 'Marriott',     description: 'Marriott International reference materials' },
  'Wyndham Tool':       { slug: 'wyndham',      name: 'Wyndham',      description: 'Wyndham Hotels and Resorts reference materials' },
};

// Skip these folder names anywhere in the path
const SKIP_FOLDERS = new Set([
  'Retired documents',
  'zArchive',
  'Training Certificates-Hotel Brands',
  'Hotel LOGOS',
]);

// Skip these file extensions
const SKIP_EXTS = new Set(['.mp4', '.mov', '.avi', '.xlsm', '.lnk', '.tmp']);

// Skip OS junk
const SKIP_NAMES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);

const FILE_TYPE_MAP = {
  '.pdf':  'pdf',
  '.docx': 'docx',
  '.doc':  'doc',
  '.xlsx': 'xlsx',
  '.pptx': 'pptx',
  '.ppt':  'ppt',
  '.txt':  'txt',
  '.png':  'png',
  '.jpg':  'jpg',
  '.jpeg': 'jpg',
};

// Normalize filenames for URLs: replace spaces and weird chars
function safeName(filename) {
  return filename
    .replace(/\s+/g, '-')
    .replace(/[^\w\-.]/g, '')
    .replace(/-+/g, '-');
}

// Convert filename to a readable title
function prettyTitle(filename) {
  const noExt = filename.replace(/\.[^.]+$/, '');
  return noExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Recursive file walker with filters
async function* walkFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_FOLDERS.has(entry.name)) continue;
      yield* walkFiles(fullPath);
    } else if (entry.isFile()) {
      if (SKIP_NAMES.has(entry.name)) continue;
      const ext = extname(entry.name).toLowerCase();
      if (SKIP_EXTS.has(ext)) continue;
      yield { path: fullPath, name: entry.name, ext };
    }
  }
}

async function scanFolder(folderPath) {
  const docs = [];
  for await (const file of walkFiles(folderPath)) {
    const stats = await stat(file.path);
    docs.push({
      sourcePath: file.path,
      filename: file.name,
      safeFilename: safeName(file.name),
      title: prettyTitle(file.name),
      fileType: FILE_TYPE_MAP[file.ext] || file.ext.replace('.', ''),
      sizeKB: Math.round(stats.size / 1024),
    });
  }
  return docs;
}

async function main() {
  console.log('Scanning:', SOURCE_ROOT);
  console.log('');

  // Cross-brand docs (files in HOTEL BRANDS root)
  const crossBrandFiles = await readdir(SOURCE_ROOT, { withFileTypes: true });
  const crossBrandDocs = [];
  for (const entry of crossBrandFiles) {
    if (entry.isFile()) {
      if (SKIP_NAMES.has(entry.name)) continue;
      const ext = extname(entry.name).toLowerCase();
      if (SKIP_EXTS.has(ext)) continue;
      const fullPath = join(SOURCE_ROOT, entry.name);
      const stats = await stat(fullPath);
      crossBrandDocs.push({
        sourcePath: fullPath,
        filename: entry.name,
        safeFilename: safeName(entry.name),
        title: prettyTitle(entry.name),
        fileType: FILE_TYPE_MAP[ext] || ext.replace('.', ''),
        sizeKB: Math.round(stats.size / 1024),
      });
    }
  }

  // Per-brand docs
  const brands = [];
  for (const [folderName, info] of Object.entries(BRAND_MAP)) {
    const folderPath = join(SOURCE_ROOT, folderName);
    const docs = await scanFolder(folderPath);
    brands.push({
      ...info,
      documents: docs,
    });
  }

  // Summary
  console.log('Cross-brand docs:', crossBrandDocs.length);
  for (const brand of brands) {
    const totalKB = brand.documents.reduce((a, d) => a + d.sizeKB, 0);
    console.log(`${brand.name.padEnd(15)} ${String(brand.documents.length).padStart(3)} files  (${(totalKB / 1024).toFixed(1)} MB)`);
  }
  const allFiles = [...crossBrandDocs, ...brands.flatMap(b => b.documents)];
  const totalMB = allFiles.reduce((a, d) => a + d.sizeKB, 0) / 1024;
  console.log('');
  console.log(`Total: ${allFiles.length} files, ${totalMB.toFixed(1)} MB`);

  // Write upload manifest (used by the upload script)
  const manifest = {
    crossBrand: crossBrandDocs.map(d => ({
      sourcePath: d.sourcePath,
      destPath: `cross-brand/${d.safeFilename}`,
      filename: d.filename,
      title: d.title,
      fileType: d.fileType,
      sizeKB: d.sizeKB,
    })),
    brands: brands.map(b => ({
      slug: b.slug,
      name: b.name,
      description: b.description,
      documents: b.documents.map(d => ({
        sourcePath: d.sourcePath,
        destPath: `${b.slug}/${d.safeFilename}`,
        filename: d.filename,
        title: d.title,
        fileType: d.fileType,
        sizeKB: d.sizeKB,
      })),
    })),
  };

  await writeFile(
    join(PROJECT_ROOT, 'scripts/upload-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Wrote: scripts/upload-manifest.json');

  // Write the brands data file (no source paths, storage paths only)
  const crossBrandData = crossBrandDocs.map(d => ({
    title: d.title,
    filename: d.safeFilename,
    storagePath: 'cross-brand/' + d.safeFilename,
    fileType: d.fileType,
    sizeKB: d.sizeKB,
  }));
  const brandsData = brands.map(b => ({
    slug: b.slug,
    name: b.name,
    description: b.description,
    documents: b.documents.map(d => ({
      title: d.title,
      filename: d.safeFilename,
      storagePath: b.slug + '/' + d.safeFilename,
      fileType: d.fileType,
      sizeKB: d.sizeKB,
    })),
  }));

  const dataFile = [
    '// Auto-generated by scripts/scan-brand-files.mjs',
    '// Do not edit by hand — re-run the script to regenerate.',
    '',
    'export const CROSS_BRAND_DOCS = ' + JSON.stringify(crossBrandData, null, 2) + ';',
    '',
    'export const BRANDS = ' + JSON.stringify(brandsData, null, 2) + ';',
    '',
  ].join('\n');

  // Ensure data dir exists
  await mkdir(join(PROJECT_ROOT, 'src/data'), { recursive: true });
  await writeFile(join(PROJECT_ROOT, 'src/data/brandsData.js'), dataFile);
  console.log('Wrote: src/data/brandsData.js');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
