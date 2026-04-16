#!/usr/bin/env node
// Extracts text from priority brand files and writes per-brand KB text files.
// Handles PDF, DOCX, PPTX, XLSX.
//
// Usage: node scripts/extract-brand-content.mjs

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const SOURCE_ROOT = 'C:/Users/Ryan/Downloads/Hotel Brand Information/HOTEL BRANDS';

// Priority files per brand — these are the key references sellers need
const PRIORITY_FILES = {
  'cross-brand': [
    { file: 'Brand Contact Titles and Email Template.docx', label: 'Brand Contact Titles' },
    { file: 'Brand Portal Reference Sheet.pdf', label: 'Brand Portal Reference' },
    { file: 'HOTEL CHAIN CODES (CCRA) Quick Reference Booking Guide(05&6of10).pdf', label: 'Hotel Chain Codes' },
    { file: 'National Accounts - Corporate ID Numbers - All brands.xlsx', label: 'National Accounts CIDs' },
  ],
  'best-western': [
    { file: 'Best Western Tools/Best Western Brand Training April 2025.pptx', label: 'Brand Training (Apr 2025)' },
    { file: 'Best Western Tools/HSO Contact List January 2026.docx', label: 'HSO Contact List' },
    { file: 'Best Western Tools/Rate Plan Marketing Guide.pdf', label: 'Rate Plan Marketing Guide' },
    { file: 'Best Western Tools/BW Best Business Select and Best Business Worldwide Rates.docx', label: 'Best Business Rates' },
  ],
  'choice': [
    { file: 'Choice Tools/CHOICE BRAND TRAINING/Choice Brand Training - PPT  Jan. 2026.pptx', label: 'Brand Training (Jan 2026)' },
    { file: 'Choice Tools/CHoice Contact List.pdf', label: 'Choice Contact List' },
    { file: 'Choice Tools/National Account Lists/National Account List 8.1.25_FRANCHISEE_CID.pdf', label: 'National Account List (Franchisee CID)' },
    { file: 'Choice Tools/CHOICE RATE PLANS/srps-at-a-glance.pdf', label: 'Special Rate Plans at a Glance' },
    { file: 'Choice Tools/Sales and Resources/LocalSales Handbook.pdf', label: 'Local Sales Handbook' },
  ],
  'hilton': [
    { file: 'Hilton Tool Kit/Hilton Brand Training - 2025.pptx', label: 'Brand Training 2025' },
    { file: 'Hilton Tool Kit/PEP One Page handout - Hilton.pdf', label: 'PEP One Page' },
    { file: 'Hilton Tool Kit/Hilton rfp-submission-playbook.pdf', label: 'RFP Submission Playbook' },
    { file: 'Hilton Tool Kit/Hilton creating-a-compelling-business-case.pdf', label: 'Creating a Compelling Business Case' },
  ],
  'hyatt': [
    { file: 'Hyatt Place/energize sales presentations HP brand exampls.pdf', label: 'Energize Sales Presentations (HP)' },
  ],
  'ihg': [
    { file: 'IHG tools/IHG Brand Training Feb 2025.pptx', label: 'Brand Training (Feb 2025)' },
    { file: 'IHG tools/IHG Way of Sales Acronym Glossary.pdf', label: 'IHG Way of Sales Acronym Glossary' },
    { file: 'IHG tools/IHG Business Edge/IHG Business Edge Program Quick Review.pdf', label: 'Business Edge Program Quick Review' },
    { file: 'IHG tools/Long-Term Stay Educational Call - Presentation.pdf', label: 'Long-Term Stay Educational Call' },
    { file: 'IHG tools/2026 Corporate Transient RFP Overview for On Property Colleagues.pdf', label: '2026 Corporate Transient RFP Overview' },
  ],
  'marriott': [
    { file: 'Marriott Tools/Marriott Brand Training Feb 2026.pptx', label: 'Brand Training (Feb 2026)' },
    { file: 'Marriott Tools/CBC Fact Sheet.pdf', label: 'CBC Fact Sheet' },
    { file: 'Marriott Tools/Marriott Cluster Codes  Sept 2024.xlsx', label: 'Marriott Cluster Codes (Sept 2024)' },
    { file: 'Marriott Tools/salesprofessionalsprospectingwhotocallon.pdf', label: 'Sales Professionals — Who To Call On' },
  ],
  'wyndham': [
    { file: 'Wyndham Tool/Wyndham Brand Training/Wyndham Brand Training PPT Feb. 2026.pptx', label: 'Brand Training (Feb 2026)' },
    { file: 'Wyndham Tool/Wyndham Sales Hotel Resources Guide_ Sept_2025.pdf', label: 'Sales Hotel Resources Guide (Sept 2025)' },
    { file: 'Wyndham Tool/Global Sales Contact List.pdf', label: 'Global Sales Contact List' },
    { file: 'Wyndham Tool/Wyndham_HowToPrepare_RFPSeason_April2023.pdf', label: 'How to Prepare for RFP Season' },
  ],
};

// Extractors
async function extractPDF(path) {
  const { PDFParse } = require('pdf-parse');
  const buf = await readFile(path);
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  try {
    const result = await parser.getText();
    return result.text || '';
  } finally {
    await parser.destroy();
  }
}

async function extractDOCX(path) {
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path });
  return result.value;
}

async function extractXLSX(path) {
  const XLSX = require('xlsx');
  const wb = XLSX.readFile(path);
  const parts = [];
  const MAX_ROWS_PER_SHEET = 200;
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_csv(sheet).split('\n');
    const truncated = rows.length > MAX_ROWS_PER_SHEET;
    const kept = rows.slice(0, MAX_ROWS_PER_SHEET).join('\n');
    parts.push(`[Sheet: ${sheetName}${truncated ? ` — truncated at ${MAX_ROWS_PER_SHEET} of ${rows.length} rows` : ''}]\n${kept}`);
  }
  return parts.join('\n\n');
}

async function extractPPTX(path) {
  // PPTX is a zip of XML files. We'll unzip, find slide XML files, strip XML tags.
  const JSZip = require('jszip');
  const buf = await readFile(path);
  const zip = await JSZip.loadAsync(buf);

  // Find all slide XML files, sorted by slide number
  const slideFiles = Object.keys(zip.files)
    .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => {
      const na = parseInt(a.match(/slide(\d+)/)[1], 10);
      const nb = parseInt(b.match(/slide(\d+)/)[1], 10);
      return na - nb;
    });

  const slides = [];
  for (let i = 0; i < slideFiles.length; i++) {
    const xml = await zip.files[slideFiles[i]].async('string');
    // Extract text between <a:t>...</a:t> tags
    const textMatches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || [];
    const texts = textMatches.map(m => {
      // Strip the tag wrapper
      const match = m.match(/<a:t[^>]*>([^<]*)<\/a:t>/);
      return match ? match[1] : '';
    }).filter(t => t.trim());
    if (texts.length) {
      slides.push(`[Slide ${i + 1}]\n${texts.join('\n')}`);
    }
  }

  return slides.join('\n\n');
}

async function extract(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith('.pdf')) return extractPDF(path);
  if (lower.endsWith('.docx')) return extractDOCX(path);
  if (lower.endsWith('.xlsx')) return extractXLSX(path);
  if (lower.endsWith('.pptx')) return extractPPTX(path);
  throw new Error(`Unsupported file type: ${path}`);
}

function cleanText(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/ +\n/g, '\n')
    .trim();
}

async function main() {
  const outputDir = join(PROJECT_ROOT, 'scripts/extracted-brand-content');
  await mkdir(outputDir, { recursive: true });

  const summary = [];

  for (const [brand, files] of Object.entries(PRIORITY_FILES)) {
    console.log(`\n=== ${brand.toUpperCase()} ===`);
    const parts = [];
    parts.push(`# ${brand.replace('-', ' ').toUpperCase()} REFERENCE CONTENT\n`);
    parts.push(`Extracted from primary reference files. Source of truth is SharePoint.\n`);

    for (const { file, label } of files) {
      const fullPath = join(SOURCE_ROOT, file);
      try {
        console.log(`  ${label}...`);
        const raw = await extract(fullPath);
        const cleaned = cleanText(raw);
        const words = cleaned.split(/\s+/).filter(Boolean).length;
        console.log(`    ${words} words`);
        parts.push(`\n---\n## ${label}\nSource: ${file}\n\n${cleaned}\n`);
        summary.push({ brand, file: label, words, status: 'ok' });
      } catch (err) {
        console.log(`    ERROR: ${err.message}`);
        parts.push(`\n---\n## ${label}\nSource: ${file}\n\n[Extraction failed: ${err.message}]\n`);
        summary.push({ brand, file: label, words: 0, status: 'error', error: err.message });
      }
    }

    const out = parts.join('');
    const outPath = join(outputDir, `${brand}.txt`);
    await writeFile(outPath, out, 'utf-8');
    const totalWords = summary.filter(s => s.brand === brand).reduce((a, s) => a + s.words, 0);
    console.log(`  Wrote ${brand}.txt (${totalWords} words, ${Math.round(out.length / 1024)} KB)`);
  }

  // Summary table
  console.log('\n\n=== SUMMARY ===');
  const totalWords = summary.reduce((a, s) => a + s.words, 0);
  const totalErrors = summary.filter(s => s.status === 'error').length;
  console.log(`Extracted ${summary.length} files, ${totalWords.toLocaleString()} total words, ${totalErrors} errors`);

  await writeFile(
    join(outputDir, '_summary.json'),
    JSON.stringify(summary, null, 2)
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
