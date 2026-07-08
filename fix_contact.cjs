const fs = require('fs');
let data = fs.readFileSync('src/pages/Contact.jsx', 'utf8');

// 1. Remove all dark: classes so it stays in light mode
data = data.replace(/dark:[^\s"']+/g, '');

// 2. Change blue brand colors to teal #0fafb8
data = data.replace(/bg-blue-50/g, 'bg-[#0fafb8]/10');
data = data.replace(/text-blue-600/g, 'text-[#0fafb8]');
data = data.replace(/border-blue-100/g, 'border-[#0fafb8]/30');
data = data.replace(/text-blue-500/g, 'text-[#0fafb8]');
data = data.replace(/focus:border-blue-500/g, 'focus:border-[#0fafb8]');
data = data.replace(/focus:ring-blue-500\/25/g, 'focus:ring-[#0fafb8]/25');
data = data.replace(/bg-blue-600/g, 'bg-[#0fafb8]');
data = data.replace(/hover:bg-blue-700/g, 'hover:bg-[#0a8d95]');
data = data.replace(/text-blue-400/g, 'text-[#0fafb8]');
data = data.replace(/group-hover:text-blue-300/g, 'group-hover:text-[#0a8d95]');
data = data.replace(/group-hover:bg-blue-500/g, 'group-hover:bg-[#0a8d95]');

// 3. Right Information Column changes to make it white with dark text
data = data.replace(/bg-slate-900 border border-slate-800 text-white/g, 'bg-white border border-slate-200/80 text-slate-900');
data = data.replace(/bg-slate-850\/60/g, 'bg-slate-50');
data = data.replace(/hover:bg-slate-800\/80/g, 'hover:bg-slate-100');
data = data.replace(/border-slate-800\/50/g, 'border-slate-200');
data = data.replace(/hover:border-slate-700\/80/g, 'hover:border-slate-300');
data = data.replace(/bg-slate-850/g, 'bg-slate-50');
data = data.replace(/border-slate-800/g, 'border-slate-200');
data = data.replace(/text-slate-300/g, 'text-slate-600');
data = data.replace(/text-white/g, 'text-slate-900');
data = data.replace(/bg-slate-800/g, 'bg-slate-100');
data = data.replace(/hover:bg-slate-700/g, 'hover:bg-slate-200');

// Fix the Whatsapp button text to be white since it's on a teal background
data = data.replace(/text-slate-900 text-\[10px\] font-black rounded-none transition-colors mt-2/g, 'text-white text-[10px] font-black rounded-none transition-colors mt-2');
data = data.replace(/text-slate-900 font-black text-sm uppercase tracking-widest/g, 'text-white font-black text-sm uppercase tracking-widest'); // The submit button

// Clean up double spaces
data = data.replace(/  +/g, ' ');

fs.writeFileSync('src/pages/Contact.jsx', data);
