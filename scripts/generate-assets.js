const fs = require('fs');
const path = require('path');

// Ensure directories
const docsDir = path.join(__dirname, '..', 'public', 'docs');
const audioDir = path.join(__dirname, '..', 'public', 'audio');

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

// 1. Generate Valid PDF Document
const pdfString = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /Contents 6 0 R
>>
endobj
4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
6 0 obj
<< /Length 650 >>
stream
BT
/F1 20 Tf
50 720 Td
(COGNITIVESCALE DYNAMICS INC. - BRAND SPECIFICATIONS) Tj
/F2 13 Tf
0 -30 Td
(B2B SaaS Corporate Redesign & Next.js 14 Technical Architecture) Tj
/F1 11 Tf
0 -26 Td
(Client: Elena Rostova - Head of Growth (talent@cognitivescaledynamics.io)) Tj
0 -18 Td
(Status: Approved Design System Document v3.2 - October 2026) Tj
/F1 12 Tf
0 -36 Td
(1. Color Matrix:) Tj
/F2 11 Tf
0 -20 Td
(   - Primary Obsidian: #080E1B  |  Meta Indigo: #1877F2  |  Electric Cyan: #00E5FF) Tj
/F1 12 Tf
0 -28 Td
(2. Scope of Work Deliverables Demanded:) Tj
/F2 11 Tf
0 -20 Td
(   - 8 to 10 Bespoke Responsive Pages with Glassmorphism Card Elevation) Tj
0 -18 Td
(   - Native Interactive Zoom Booking Flow + WhatsApp Direct CTA) Tj
0 -18 Td
(   - Google PageSpeed Performance Score > 95 with sub-300ms transitions) Tj
/F1 12 Tf
0 -28 Td
(3. Commercial Terms & SLA:) Tj
/F2 11 Tf
0 -20 Td
(   - Delivery Timeline: 7-10 Business Days) Tj
0 -18 Td
(   - Standard Mutual Non-Disclosure Agreement (NDA) Pre-Cleared) Tj
ET
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000068 00000 n 
0000000135 00000 n 
0000000318 00000 n 
0000000408 00000 n 
0000000493 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
1195
%%EOF`;

const pdfPath = path.join(docsDir, 'CognitiveScale_Brand_Identity_v3.pdf');
fs.writeFileSync(pdfPath, pdfString);
console.log('✅ Generated valid PDF at:', pdfPath);

// Also generate Specs PDF for simulated client replies
const specsPdfPath = path.join(docsDir, 'Client_Specification_Guidelines.pdf');
fs.writeFileSync(specsPdfPath, pdfString);

// 2. Generate Valid 16-bit 44.1kHz Audio WAV File for Voice Notes
// Create a 15-second pleasant melody / voice chime sequence so it plays cleanly in any browser
const sampleRate = 44100;
const durationSeconds = 15;
const numChannels = 1;
const bytesPerSample = 2;
const numSamples = sampleRate * durationSeconds;
const dataSize = numSamples * numChannels * bytesPerSample;
const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);

// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Chunk size
buffer.writeUInt16LE(1, 20);  // Audio format 1 (PCM)
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // Byte rate
buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // Block align
buffer.writeUInt16LE(bytesPerSample * 8, 34); // Bits per sample

// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Generate smooth vocal chime tone (speech formant frequencies around 220Hz - 440Hz with smooth envelope)
const speechNotes = [
  { freq: 261.63, dur: 1.5 }, // C4
  { freq: 329.63, dur: 1.5 }, // E4
  { freq: 392.00, dur: 2.0 }, // G4
  { freq: 440.00, dur: 2.5 }, // A4
  { freq: 392.00, dur: 2.0 }, // G4
  { freq: 329.63, dur: 2.5 }, // E4
  { freq: 261.63, dur: 3.0 }, // C4
];

let sampleIndex = 0;
speechNotes.forEach((note) => {
  const noteSamples = Math.floor(note.dur * sampleRate);
  for (let i = 0; i < noteSamples && sampleIndex < numSamples; i++) {
    const t = i / sampleRate;
    // Envelope: smooth attack and decay
    const envelope = Math.sin((i / noteSamples) * Math.PI);
    // Harmonic frequencies simulating human voice resonance
    const val = 
      (Math.sin(2 * Math.PI * note.freq * t) * 0.6 +
       Math.sin(2 * Math.PI * note.freq * 2 * t) * 0.25 +
       Math.sin(2 * Math.PI * note.freq * 3 * t) * 0.15) * envelope;

    const sample16 = Math.max(-32768, Math.min(32767, Math.floor(val * 16000)));
    buffer.writeInt16LE(sample16, 44 + sampleIndex * 2);
    sampleIndex++;
  }
});

const audioPath = path.join(audioDir, 'dr-zeeshan-voicenote.wav');
fs.writeFileSync(audioPath, buffer);
console.log('✅ Generated valid Voice Note audio file at:', audioPath);
