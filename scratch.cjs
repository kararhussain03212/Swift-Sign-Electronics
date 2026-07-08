const fs = require('fs');
let data = fs.readFileSync('src/pages/Contact.jsx', 'utf8');

// Strip all dark: classes
data = data.replace(/dark:[^\s"']+/g, '');

// Convert right column dark colors to light
data = data.replace(/bg-slate-900 border border-slate-800 text-white/g, 'bg-white border border-slate-200/80 text-slate-900');
data = data.replace(/bg-slate-850/g, 'bg-slate-50');
data = data.replace(/border-slate-800/g, 'border-slate-200');
data = data.replace(/text-slate-300/g, 'text-slate-600');
data = data.replace(/border-slate-800\/50/g, 'border-slate-200');
data = data.replace(/hover:border-slate-700\/80/g, 'hover:border-slate-300');
data = data.replace(/text-white/g, 'text-slate-900');
data = data.replace(/bg-slate-800/g, 'bg-slate-100');
data = data.replace(/hover:bg-slate-700/g, 'hover:bg-slate-200');

// Clean up any double spaces left by removing dark classes
data = data.replace(/  +/g, ' ');

fs.writeFileSync('src/pages/Contact.jsx', data);
