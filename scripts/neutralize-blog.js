// Neutralize blog articles: remove emojis, colorful classes, gradients, add image placeholder
// Processes all files in pages/blog/*.js (excluding index.js)

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(process.cwd(), 'pages', 'blog');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function neutralize(content) {
  let out = content;

  // 1) Remove emojis (common ranges) + variation selectors
  // Covers: Misc Symbols & Pictographs, Supplemental Symbols & Pictographs, Emoticons, Transport, Dingbats, Flags
  // Expanded to include U+1F000–U+1FAFF (emoji blocks), flags, dingbats, misc tech (2300–23FF), etc.
  const emojiRegex = /[\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2300}-\u{23FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F\u200D]/gu;
  out = out.replace(emojiRegex, '');

  // Also clean leftover double spaces from emoji removal
  out = out.replace(/\s{2,}/g, ' ');

  // 2) Remove colorful Tailwind text/bg/border classes and gradients
  const tokensToRemove = [
    // gradients
    'bg-gradient-to-r', 'bg-gradient-to-l', 'bg-gradient-to-b', 'bg-gradient-to-t', 'bg-gradient-to-tr', 'bg-gradient-to-tl', 'bg-gradient-to-br', 'bg-gradient-to-bl',
    // common text colors
    'text-red-50','text-red-100','text-red-200','text-red-300','text-red-400','text-red-500','text-red-600','text-red-700','text-red-800','text-red-900',
    'text-green-50','text-green-100','text-green-200','text-green-300','text-green-400','text-green-500','text-green-600','text-green-700','text-green-800','text-green-900',
    'text-blue-50','text-blue-100','text-blue-200','text-blue-300','text-blue-400','text-blue-500','text-blue-600','text-blue-700','text-blue-800','text-blue-900',
    'text-yellow-50','text-yellow-100','text-yellow-200','text-yellow-300','text-yellow-400','text-yellow-500','text-yellow-600','text-yellow-700','text-yellow-800','text-yellow-900',
    'text-purple-50','text-purple-100','text-purple-200','text-purple-300','text-purple-400','text-purple-500','text-purple-600','text-purple-700','text-purple-800','text-purple-900',
    'text-orange-50','text-orange-100','text-orange-200','text-orange-300','text-orange-400','text-orange-500','text-orange-600','text-orange-700','text-orange-800','text-orange-900',
    'text-teal-50','text-teal-100','text-teal-200','text-teal-300','text-teal-400','text-teal-500','text-teal-600','text-teal-700','text-teal-800','text-teal-900',
    // bg colors
    'bg-red-50','bg-red-100','bg-red-200','bg-red-300','bg-red-400','bg-red-500','bg-red-600','bg-red-700','bg-red-800','bg-red-900',
    'bg-green-50','bg-green-100','bg-green-200','bg-green-300','bg-green-400','bg-green-500','bg-green-600','bg-green-700','bg-green-800','bg-green-900',
    'bg-blue-50','bg-blue-100','bg-blue-200','bg-blue-300','bg-blue-400','bg-blue-500','bg-blue-600','bg-blue-700','bg-blue-800','bg-blue-900',
    'bg-yellow-50','bg-yellow-100','bg-yellow-200','bg-yellow-300','bg-yellow-400','bg-yellow-500','bg-yellow-600','bg-yellow-700','bg-yellow-800','bg-yellow-900',
    'bg-purple-50','bg-purple-100','bg-purple-200','bg-purple-300','bg-purple-400','bg-purple-500','bg-purple-600','bg-purple-700','bg-purple-800','bg-purple-900',
    'bg-orange-50','bg-orange-100','bg-orange-200','bg-orange-300','bg-orange-400','bg-orange-500','bg-orange-600','bg-orange-700','bg-orange-800','bg-orange-900',
    'bg-teal-50','bg-teal-100','bg-teal-200','bg-teal-300','bg-teal-400','bg-teal-500','bg-teal-600','bg-teal-700','bg-teal-800','bg-teal-900',
    // borders
    'border-red-50','border-red-100','border-red-200','border-red-300','border-red-400','border-red-500','border-red-600','border-red-700','border-red-800','border-red-900',
    'border-green-50','border-green-100','border-green-200','border-green-300','border-green-400','border-green-500','border-green-600','border-green-700','border-green-800','border-green-900',
    'border-blue-50','border-blue-100','border-blue-200','border-blue-300','border-blue-400','border-blue-500','border-blue-600','border-blue-700','border-blue-800','border-blue-900',
    'border-yellow-50','border-yellow-100','border-yellow-200','border-yellow-300','border-yellow-400','border-yellow-500','border-yellow-600','border-yellow-700','border-yellow-800','border-yellow-900',
    'border-purple-50','border-purple-100','border-purple-200','border-purple-300','border-purple-400','border-purple-500','border-purple-600','border-purple-700','border-purple-800','border-purple-900',
    'border-orange-50','border-orange-100','border-orange-200','border-orange-300','border-orange-400','border-orange-500','border-orange-600','border-orange-700','border-orange-800','border-orange-900',
    'border-teal-50','border-teal-100','border-teal-200','border-teal-300','border-teal-400','border-teal-500','border-teal-600','border-teal-700','border-teal-800','border-teal-900',
    // stateful and hover variants using colors
    'group-hover:text-blue-600','group-hover:text-green-600','group-hover:text-orange-600',
  ];

  for (const token of tokensToRemove) {
    const re = new RegExp(`\\b${token}\\b`, 'g');
    out = out.replace(re, '');
  }

  // Remove utility tokens for gradient colors like from-*, via-*, to-* (simple approach)
  out = out.replace(/\b(from|via|to)-[a-zA-Z0-9\/\[\]#.:_-]+\b/g, '');

  // Remove leftover double spaces inside className strings
  out = out.replace(/className=\"([^\"]+)\"/g, (m, classes) => {
    const cleaned = classes
      .split(/\s+/)
      .filter(Boolean)
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return `className="${cleaned}"`;
  });

  // 3) Remove standalone "text-white" but keep opacity variants like text-white/70
  out = out.replace(/\btext-white(?!\/[0-9]{2})\b/g, '');

  // 4) Introduce neutral containers similar to homepage for obvious colored blocks
  // Convert very colorful callouts (bg-*-50 etc removed above) into neutral bordered boxes by ensuring they at least have border + bg
  out = out.replace(/className=\"([^\"]*)\b(p-\d+[^\"]*)\"/g, (m, pre, rest) => {
    // If element seems like a callout (has p- classes), ensure it has neutral border/bg if it lacks any bg/border already
    const hasBorder = /\bborder\b/.test(pre + rest);
    const hasBg = /\bbg-/.test(pre + rest);
    let classes = (pre + rest).trim();
    if (!hasBorder) classes += ' border border-black/10 dark:border-white/10';
    if (!hasBg) classes += ' bg-white/70 dark:bg-white/5';
    // ensure neutral text color on callouts
    if (!/text-black\/70|text-gray-600|text-gray-700|text-gray-800|text-gray-900/.test(classes)) {
      classes += ' text-black/70 dark:text-white/70';
    }
    classes = classes.replace(/\s{2,}/g, ' ').trim();
    return `className="${classes}"`;
  });

  // 5) Add a header image placeholder after the main H1 if not present
  if (out.includes('<h1') && !out.includes('data-placeholder="header-image"')) {
    out = out.replace(/(<h1[^>]*>[^<]*<\/h1>)/, `$1\n          <div data-placeholder="header-image" className=\"rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 aspect-[16/9] flex items-center justify-center text-sm text-black/60 dark:text-white/60 my-6\">Image placeholder</div>`);
  }

  // 6) Fix accidental artifacts from removals (e.g., dark:/70)
  out = out.replace(/dark:\/([0-9]{2})/g, 'dark:text-white/$1');

  // 6b) Neutralize dynamic color bar classes like bg-${operator.color}-500
  out = out.replace(/className=\{\s*`bg-\$\{operator\.color\}-500 h-2 rounded-full`\s*\}/g,
    'className="bg-black/20 dark:bg-white/20 h-2 rounded-full"');

  // 7) Normalize section headers that had leading icons: now removed by emoji pass, but ensure no double spaces in titles
  out = out.replace(/>\s+</g, '><');

  return out;
}

function run() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.js') && f !== 'index.js');

  for (const f of files) {
    const full = path.join(BLOG_DIR, f);
    const before = read(full);
    const after = neutralize(before);
    if (before !== after) {
      write(full, after);
      console.log(`Updated: ${f}`);
    } else {
      console.log(`No change: ${f}`);
    }
  }
}

run();
