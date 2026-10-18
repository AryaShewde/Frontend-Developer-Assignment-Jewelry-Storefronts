import fs from 'node:fs';
import path from 'node:path';

function generateRingSvg(brand, color, shape, view) {
  const isAurelle = brand === 'aurelle';
  const isGemma = brand === 'gemma-grove';
  const isLustre = brand === 'lustre';

  const bgColor = isAurelle ? '#fcf9f2' : isGemma ? '#f8f5fb' : '#0d1117';
  const bandColor = isAurelle ? '#d4af37' : isGemma ? '#c5a059' : '#e2e8f0';
  const bandShadow = isAurelle ? '#997c1e' : isGemma ? '#826322' : '#94a3b8';
  const accentSparkle = isLustre ? '#38bdf8' : isAurelle ? '#fef08a' : '#f472b6';

  let stoneFill = color;
  let stoneHighlight = '#ffffff';

  if (isAurelle) {
    stoneFill = '#f8fafc';
    stoneHighlight = '#ffffff';
  } else if (isLustre) {
    stoneFill = '#f1f5f9';
    stoneHighlight = '#ffffff';
  }

  const isEarring = shape.includes('earring') || shape.includes('stud') || shape.includes('hoop');

  let content = '';

  if (isEarring) {
    // Earrings SVG
    content = `
      <defs>
        <radialGradient id="earringGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${stoneHighlight}" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="${stoneFill}" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="${stoneFill}" stop-opacity="0.3"/>
        </radialGradient>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bandColor}"/>
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${bandShadow}"/>
        </linearGradient>
      </defs>

      <!-- Left Earring -->
      <g transform="translate(140, 200)">
        <circle cx="0" cy="0" r="42" fill="url(#metalGrad)" stroke="${bandShadow}" stroke-width="2"/>
        <polygon points="0,-36 25,-15 25,15 0,36 -25,15 -25,-15" fill="url(#earringGlow)" stroke="${stoneHighlight}" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="14" fill="#ffffff" opacity="0.8"/>
        <!-- sparkle -->
        <path d="M0,-24 L3,-6 L21,0 L3,6 L0,24 L-3,6 L-21,0 L-3,-6 Z" fill="${accentSparkle}" opacity="0.65"/>
      </g>

      <!-- Right Earring -->
      <g transform="translate(260, 200)">
        <circle cx="0" cy="0" r="42" fill="url(#metalGrad)" stroke="${bandShadow}" stroke-width="2"/>
        <polygon points="0,-36 25,-15 25,15 0,36 -25,15 -25,-15" fill="url(#earringGlow)" stroke="${stoneHighlight}" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="14" fill="#ffffff" opacity="0.8"/>
        <!-- sparkle -->
        <path d="M0,-24 L3,-6 L21,0 L3,6 L0,24 L-3,6 L-21,0 L-3,-6 Z" fill="${accentSparkle}" opacity="0.65"/>
      </g>
    `;
  } else {
    // Ring SVG
    const rotation = view === 2 ? 'transform="rotate(18 200 220)"' : view === 3 ? 'transform="rotate(-15 200 220) scale(1.15)"' : '';

    content = `
      <defs>
        <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bandShadow}"/>
          <stop offset="35%" stop-color="${bandColor}"/>
          <stop offset="65%" stop-color="#ffffff" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="${bandShadow}"/>
        </linearGradient>
        <radialGradient id="gemGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stop-color="${stoneHighlight}"/>
          <stop offset="45%" stop-color="${stoneFill}"/>
          <stop offset="100%" stop-color="${isGemma ? color : isLustre ? '#cbd5e1' : '#cbd5e1'}"/>
        </radialGradient>
      </defs>

      <g ${rotation}>
        <!-- Ring Shank/Band -->
        <ellipse cx="200" cy="250" rx="95" ry="85" fill="none" stroke="url(#bandGrad)" stroke-width="22" stroke-linecap="round"/>
        <ellipse cx="200" cy="250" rx="95" ry="85" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
        <ellipse cx="200" cy="250" rx="84" ry="74" fill="none" stroke="${bgColor}" stroke-width="4"/>

        <!-- Prongs Base -->
        <rect x="188" y="152" width="24" height="20" rx="4" fill="url(#bandGrad)"/>
        <path d="M178,160 L188,140 L212,140 L222,160 Z" fill="${bandColor}" stroke="${bandShadow}" stroke-width="1.5"/>

        <!-- Center Gemstone -->
        ${getStoneShape(shape, stoneFill, stoneHighlight, color, isGemma, isLustre, accentSparkle)}

        <!-- Prongs Tips -->
        <circle cx="178" cy="120" r="4" fill="url(#bandGrad)"/>
        <circle cx="222" cy="120" r="4" fill="url(#bandGrad)"/>
        <circle cx="178" cy="155" r="4" fill="url(#bandGrad)"/>
        <circle cx="222" cy="155" r="4" fill="url(#bandGrad)"/>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="${bgColor}"/>
    <!-- Subtle inner vignette frame -->
    <rect x="12" y="12" width="376" height="376" rx="8" fill="none" stroke="${bandColor}" stroke-opacity="0.15" stroke-width="1"/>
    ${content}
  </svg>`;
}

function getStoneShape(shape, fill, highlight, gemColor, isGemma, isLustre, accent) {
  if (shape.includes('emerald') || shape.includes('baguette') || shape.includes('east-west')) {
    // Octagonal / Emerald Cut
    return `
      <g transform="translate(200, 136)">
        <polygon points="-36,-26 36,-26 48,-14 48,14 36,26 -36,26 -48,14 -48,-14" fill="url(#gemGrad)" stroke="${isGemma ? gemColor : '#94a3b8'}" stroke-width="2"/>
        <polygon points="-26,-18 26,-18 34,-10 34,10 26,18 -26,18 -34,10 -34,-10" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        <!-- facet lines -->
        <line x1="-48" y1="-14" x2="-34" y2="-10" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
        <line x1="48" y1="-14" x2="34" y2="-10" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
        <line x1="48" y1="14" x2="34" y2="10" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
        <line x1="-48" y1="14" x2="-34" y2="10" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
        <polygon points="-12,-8 12,-8 18,-2 18,2 12,8 -12,8 -18,2 -18,-2" fill="#ffffff" opacity="0.4"/>
      </g>
    `;
  } else if (shape.includes('oval') || shape.includes('cushion')) {
    // Oval / Cushion Cut
    return `
      <g transform="translate(200, 136)">
        <ellipse cx="0" cy="0" rx="42" ry="32" fill="url(#gemGrad)" stroke="${isGemma ? gemColor : '#94a3b8'}" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="28" ry="20" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.75"/>
        <polygon points="0,-20 18,-6 14,14 -14,14 -18,-6" fill="#ffffff" opacity="0.35"/>
        <!-- sparkle star -->
        <path d="M-10,-10 L-7,-3 L0,0 L-7,3 L-10,10 L-13,3 L-20,0 L-13,-3 Z" fill="${accent}" opacity="0.7"/>
      </g>
    `;
  } else if (shape.includes('pear')) {
    // Pear Cut
    return `
      <g transform="translate(200, 134)">
        <path d="M0,-38 C32,-6 38,20 0,36 C-38,20 -32,-6 0,-38 Z" fill="url(#gemGrad)" stroke="${isGemma ? gemColor : '#94a3b8'}" stroke-width="2"/>
        <path d="M0,-24 C20,-4 24,14 0,24 C-24,14 -20,-4 0,-24 Z" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
        <circle cx="0" cy="-4" r="8" fill="#ffffff" opacity="0.5"/>
      </g>
    `;
  } else if (shape.includes('marquise')) {
    // Marquise Cut
    return `
      <g transform="translate(200, 136)">
        <path d="M-48,0 C-24,-26 24,-26 48,0 C24,26 -24,26 -48,0 Z" fill="url(#gemGrad)" stroke="${isGemma ? gemColor : '#94a3b8'}" stroke-width="2"/>
        <path d="M-32,0 C-16,-16 16,-16 32,0 C16,16 -16,16 -32,0 Z" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.75"/>
        <polygon points="0,-12 12,0 0,12 -12,0" fill="#ffffff" opacity="0.4"/>
      </g>
    `;
  } else {
    // Brilliant Round / Solitaire / Halo
    return `
      <g transform="translate(200, 136)">
        <circle cx="0" cy="0" r="38" fill="url(#gemGrad)" stroke="${isGemma ? gemColor : '#94a3b8'}" stroke-width="2"/>
        <!-- Facet pattern -->
        <polygon points="0,-36 24,-24 36,0 24,24 0,36 -24,24 -36,0 -24,-24" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.6"/>
        <polygon points="0,-22 18,-10 18,10 0,22 -18,10 -18,-10" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        <polygon points="0,-12 10,0 0,12 -10,0" fill="#ffffff" opacity="0.5"/>
        <!-- Star burst sparkle -->
        <path d="M12,-16 L15,-7 L24,-4 L15,-1 L12,8 L9,-1 L0,-4 L9,-7 Z" fill="${accent}" opacity="0.8"/>
      </g>
    `;
  }
}

export { generateRingSvg };
