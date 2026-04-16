import { useState, useMemo } from 'react';
import { G } from '../constants/colors.js';
import { CROSS_BRAND_DOCS, BRANDS } from '../data/brandsData.js';

// Brand visual accents — used for card borders and detail page headers
const BRAND_ACCENTS = {
  'best-western':  { color: '#003DA5', bg: '#EEF3FA' },
  'choice':        { color: '#E31B23', bg: '#FDEEF0' },
  'hilton':        { color: '#104C97', bg: '#EDF1F7' },
  'hyatt':         { color: '#1A1A1A', bg: '#F2F2F2' },
  'ihg':           { color: '#B8860B', bg: '#FDF6E4' },
  'marriott':      { color: '#A81E32', bg: '#FBECEE' },
  'wyndham':       { color: '#003366', bg: '#EBF0F6' },
};

// SharePoint folder URLs per brand (placeholder — Ryan can update)
const SHAREPOINT_URLS = {
  'best-western':  '#',
  'choice':        '#',
  'hilton':        '#',
  'hyatt':         '#',
  'ihg':           '#',
  'marriott':      '#',
  'wyndham':       '#',
};

// Supabase Storage base URL for downloads
const STORAGE_BASE = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-docs`
  : '';

function DocCard({ doc, accentColor }) {
  const url = STORAGE_BASE ? `${STORAGE_BASE}/${doc.storagePath}` : '#';
  const icon = doc.fileType === 'pdf' ? 'PDF' : doc.fileType === 'xlsx' ? 'XLS' : doc.fileType === 'docx' ? 'DOC' : doc.fileType === 'pptx' ? 'PPT' : doc.fileType.toUpperCase();
  const sizeMB = (doc.sizeKB / 1024).toFixed(1);
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      background: G.white,
      border: `1px solid ${G.border}`,
      borderRadius: 10,
      textDecoration: 'none',
      color: 'inherit',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = accentColor || G.teal;
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = G.border;
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: 8,
        background: accentColor || G.purple,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.05em',
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 13.5, fontWeight: 600, color: G.dark, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{doc.title}</div>
        <div style={{fontSize: 11, color: G.muted}}>{doc.fileType.toUpperCase()} · {sizeMB} MB</div>
      </div>
    </a>
  );
}

function BrandLanding({ onSelectBrand }) {
  return (
    <div style={{maxWidth: 1100, margin: '0 auto'}}>
      {/* Header */}
      <div style={{marginBottom: 28}}>
        <h2 style={{fontSize: 22, fontWeight: 700, color: G.dark, margin: 0, marginBottom: 4}}>Hotel Brands</h2>
        <p style={{fontSize: 14, color: G.muted, margin: 0}}>Brand-specific reference materials. Tap a brand to browse its resources and chat with Tammy with that brand's context loaded.</p>
      </div>

      {/* Cross-brand section */}
      <div style={{marginBottom: 36}}>
        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: G.muted, marginBottom: 12}}>Cross-Brand References</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10}}>
          {CROSS_BRAND_DOCS.map(d => <DocCard key={d.filename} doc={d} accentColor={G.purple}/>)}
        </div>
      </div>

      {/* Brand grid */}
      <div>
        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: G.muted, marginBottom: 12}}>Brand Families</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14}}>
          {BRANDS.map(brand => {
            const accent = BRAND_ACCENTS[brand.slug] || { color: G.purple, bg: G.purpleLight };
            return (
              <button
                key={brand.slug}
                onClick={() => onSelectBrand(brand.slug)}
                style={{
                  textAlign: 'left',
                  padding: '20px 18px',
                  background: G.white,
                  border: `1px solid ${G.border}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = accent.color;
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = G.border;
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                <div style={{
                  display: 'inline-block',
                  padding: '5px 10px',
                  borderRadius: 6,
                  background: accent.bg,
                  color: accent.color,
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 10,
                }}>{brand.name}</div>
                <div style={{fontSize: 13, color: G.text, lineHeight: 1.5, marginBottom: 12}}>{brand.description}</div>
                <div style={{fontSize: 11, color: G.muted, fontWeight: 600}}>{brand.documents.length} {brand.documents.length === 1 ? 'document' : 'documents'} →</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BrandDetail({ brand, onBack, onAskTammy }) {
  const accent = BRAND_ACCENTS[brand.slug] || { color: G.purple, bg: G.purpleLight };
  const sharepointUrl = SHAREPOINT_URLS[brand.slug];
  const [filter, setFilter] = useState('');

  const filteredDocs = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return brand.documents;
    return brand.documents.filter(d => d.title.toLowerCase().includes(q));
  }, [brand, filter]);

  return (
    <div style={{maxWidth: 1000, margin: '0 auto'}}>
      {/* Breadcrumb */}
      <button onClick={onBack} style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        color: G.teal,
        fontFamily: 'inherit',
        padding: 0,
        marginBottom: 18,
      }}>← Back to Brands</button>

      {/* Brand header */}
      <div style={{
        padding: '24px 28px',
        borderRadius: 14,
        background: accent.bg,
        border: `1px solid ${accent.color}22`,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{fontSize: 26, fontWeight: 700, color: accent.color, margin: 0, marginBottom: 6}}>{brand.name}</h2>
          <p style={{fontSize: 14, color: G.text, margin: 0, maxWidth: 600}}>{brand.description}</p>
        </div>
        <button onClick={onAskTammy} style={{
          padding: '11px 20px',
          borderRadius: 10,
          border: 'none',
          background: `linear-gradient(135deg, ${G.purple}, ${G.lilac})`,
          color: 'white',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 10px rgba(61,43,107,0.25)',
        }}>
          Ask Tammy about {brand.name} →
        </button>
      </div>

      {/* SharePoint link callout */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 10,
        background: G.white,
        border: `1px dashed ${G.border}`,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        flexWrap: 'wrap',
      }}>
        <div style={{fontSize: 12.5, color: G.muted, lineHeight: 1.5, maxWidth: 600}}>
          This page shows the most-used {brand.name} documents. For the full library including retired materials, training recordings, and logos — open the SharePoint folder.
        </div>
        <a href={sharepointUrl} target="_blank" rel="noopener noreferrer" style={{
          padding: '8px 14px',
          borderRadius: 8,
          border: `1px solid ${G.border}`,
          background: G.white,
          color: G.teal,
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>Open in SharePoint →</a>
      </div>

      {/* Filter */}
      {brand.documents.length > 6 && (
        <div style={{marginBottom: 14}}>
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder={`Filter ${brand.name} documents...`}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: `1px solid ${G.border}`,
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              background: G.white,
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Documents */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10}}>
        {filteredDocs.map(d => <DocCard key={d.filename} doc={d} accentColor={accent.color}/>)}
      </div>

      {filteredDocs.length === 0 && (
        <div style={{textAlign: 'center', padding: '40px 20px', color: G.muted, fontSize: 13}}>
          No documents match "{filter}".
        </div>
      )}
    </div>
  );
}

export default function Brands({ selectedBrandSlug, onSelectBrand, onBack, onAskTammy }) {
  if (selectedBrandSlug) {
    const brand = BRANDS.find(b => b.slug === selectedBrandSlug);
    if (!brand) {
      return (
        <div style={{padding: 40}}>
          <button onClick={onBack} style={{background: 'none', border: 'none', color: G.teal, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit'}}>← Back to Brands</button>
          <p style={{color: G.muted, marginTop: 20}}>Brand not found.</p>
        </div>
      );
    }
    return <BrandDetail brand={brand} onBack={onBack} onAskTammy={onAskTammy}/>;
  }

  return <BrandLanding onSelectBrand={onSelectBrand}/>;
}
