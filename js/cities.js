// viz.js — Chernoff‑Cat visualization with template SVG
// -----------------------------------------------------------------------------
// ✦ Features added in this revision
//   1.  MUCH BIGGER cats → two‑row layout that fills the drawing area.
//   2.  City label centred sotto ogni gatto (non scalata).
//   3.  Tooltip (HTML <title>) su ogni parte del corpo con il valore numerico.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// 0.  Minimal cat template (background rectangles stripped)
// -----------------------------------------------------------------------------
const CAT_TEMPLATE = `
<g id="glyph-root">
  <!-- def gaussian blur -->
  <defs>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
    </filter>
  </defs>
  <ellipse cx="120" cy="200" rx="75" ry="15" fill="rgba(0, 0, 0, 0.07)" filter="url(#blur)"/>

  <g id="head">
  <!-- ------------- ORECCHIE ------------- -->
    <g id="ears">
      <g id="earLeft">
        <path d="M37.8372 20.573L67.8669 37.9108L37.8372 55.2486V20.573Z" fill="#FCC058"/>
        <path d="M54.6276 37.9111L44.456 43.7837L44.4554 32.0386L54.6276 37.9111Z" fill="white" stroke="black" stroke-width="2"/>
      </g>
      <g id="earRight">   
        <path d="M116.931 20.573L86.9013 37.9108L116.931 55.2486V20.573Z" fill="#FCC058"/>
        <path d="M100.14 37.9111L110.312 43.7837L110.313 32.0386L100.14 37.9111Z" fill="white" stroke="black" stroke-width="2"/>
      </g>
    </g>
    <circle cx="77.384" cy="79.8063" r="47.3867" fill="#FCC058"/>
    <!-- maschere + bocca -->
    <defs>
      <mask id="mouthLeftMask" fill="white">
        <path d="M64.3442 79.8063c0 3.137-1.246 6.145-3.464 8.363-2.218 2.218-5.226
                 3.464-8.363 3.464s-6.145-1.246-8.363-3.464c-2.218-2.218-3.464-5.226-3.464-8.363h23.654Z"/>
      </mask>
      <mask id="mouthRightMask" fill="white">
        <path d="M114.08 79.8063c0 3.137-1.246 6.145-3.464 8.363-2.218 2.218-5.226
                 3.464-8.363 3.464s-6.145-1.246-8.363-3.464c-2.218-2.218-3.464-5.226-3.464-8.363h23.654Z"/>
      </mask>
    </defs>

    <!-- baffi / naso -->
    <line x1="46.3029" y1="107.637" x2="108.983" y2="107.637"
          stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0.5" y1="-0.5" x2="62.2445" y2="-0.5"
          transform="matrix(0.97503 -0.222072 -0.34418 -0.938904 47.0542 113.96)"
          stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0.5" y1="-0.5" x2="62.2445" y2="-0.5"
          transform="matrix(0.97503 0.222072 -0.34418 0.938904 47.0542 101.17)"
          stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="77.423" y1="107.529" x2="77.423" y2="114.041" stroke="black"
          stroke-linecap="round"/>
    <path d="M78.01 105.873c-.366.294-.886.294-1.252 0l-1.804-1.448c-.736-.592-.318-1.78.626-1.78h3.61c.944 0 1.362
             1.188.626 1.78l-1.806 1.448Z" fill="black" stroke="black"/>
    <path d="M72.8598 113.293c3.363 2.26 7.433.941 9.047 0" stroke="black"
          stroke-linecap="round"/>
  </g>
  <!-- ------------- OCCHI ------------- -->
  <g id="eyes">
    <path d="M64.3442 79.8063c0 3.137-1.246 6.145-3.464 8.363-2.218 2.218-5.226 3.464-8.363 3.464s-6.145-1.246-8.363-3.464c-2.218-2.218-3.464-5.226-3.464-8.363h23.654Z" fill="white" stroke="black" stroke-width="4"/>
    <path d="M114.08 79.8063c0 3.137-1.246 6.145-3.464 8.363-2.218 2.218-5.226 3.464-8.363 3.464s-6.145-1.246-8.363-3.464c-2.218-2.218-3.464-5.226-3.464-8.363h23.654Z" fill="white" stroke="black" stroke-width="4"/>
  </g>
  <!-- ------------- CODA ------------- -->
  <g id="tail">
    <rect x="173.989" y="92.2574" width="13.9589" height="36.5317" rx="6.97944" fill="#FCC058"/>
  </g>
  <!-- corpo e zampe + stellina (body kept for colouring) -->
  <g id="body">
    <g id="legsfront">
      <rect width="13.9589" height="42.182" rx="6.97944" transform="matrix(-1 0 0 1 79.6456 161.255)" fill="#FCC058"/>
      <rect width="13.9589" height="42.182" rx="6.97944" transform="matrix(-1 0 0 1 163.017 161.255)" fill="#FCC058"/>
    </g>
    <g id="legsback">
      <rect width="13.9589" height="37.1116" rx="6.97944" transform="matrix(-1 0 0 1 97.4032 161.255)" fill="#FCC058"/>
      <rect width="13.9589" height="37.1116" rx="6.97944" transform="matrix(-1 0 0 1 180.774 161.255)" fill="#FCC058"/>
    </g>
    <rect class="bodychest" x="52.9147" y="130.992" width="140.586" height="41.5093" rx="20.7546" fill="#FCC058"/>
  </g>
  <path d="M183.322 156.164L183.413 153.664L181.299 155.005L180.754 154.051L182.981 152.891L180.754 151.732L181.299 150.778L183.413 152.119L183.322 149.619H184.413L184.322 152.119L186.436 150.778L186.981 151.732L184.754 152.891L186.981 154.051L186.436 155.005L184.322 153.664L184.413 156.164H183.322Z" fill="black"/>
</g>`;

// -----------------------------------------------------------------------------
// 1. SVG container and layout constants
// -----------------------------------------------------------------------------
const svg     = d3.select('#cats-grid');
const vb      = svg.attr('viewBox').split(/\s+/).map(Number);  // [x, y, w, h]
const width   = vb[2];
const height  = vb[3];

const ROWS    = 2;          // → cats will fill at most two rows
const PAD_X   = 30;
const PAD_Y   = 20;

let spacingX, spacingY, baseScale, catsPerRow, catHeight;

// -----------------------------------------------------------------------------
// 2. Data‑value → scale‑factor mapping
// -----------------------------------------------------------------------------
const scaleSpecs = {
  ear_length : [0.6, 1.5],
  eye_width  : [0.6, 1.5],
  head_size  : [0.8, 1.1],
  tail_length: [0.5, 1.8]
};
const scales = {};

// -----------------------------------------------------------------------------
// 3. Utility: anchors & pivot (operate inside each glyph)
// -----------------------------------------------------------------------------
function getAnchors(glyph) {
  const bbHead     = glyph.select('.head').node().getBBox();
  const bbTail     = glyph.select('.tail').node().getBBox();
  const bbEarLeft  = glyph.select('.ear-left').node().getBBox();
  const bbEarRight = glyph.select('.ear-right').node().getBBox();
  return {
    headCenter : [bbHead.x + bbHead.width/2, bbHead.y + bbHead.height/2],
    headJoint  : [bbHead.x + bbHead.width/2, bbHead.y + bbHead.height],
    tailJoint  : [bbTail.x + bbTail.width/2, bbTail.y + bbTail.height],
    earLeft    : [bbEarLeft.x + bbEarLeft.width/2, bbEarLeft.y + bbEarLeft.height],
    earRight   : [bbEarRight.x + bbEarRight.width/2, bbEarRight.y + bbEarRight.height]
  };
}
function pivot(sel, [ax, ay], s) {
  sel.attr('transform', `translate(${ax - ax*s},${ay - ay*s}) scale(${s})`);
}

// -----------------------------------------------------------------------------
// 4. Main
// -----------------------------------------------------------------------------
d3.json('data/cats.json').then(data => {

  // ── Layout metrics ─────────────────────────────────────────────────────────
  catsPerRow = Math.ceil(data.length / ROWS);
  spacingX   = (width  - PAD_X*2) / catsPerRow;
  spacingY   = (height - PAD_Y*2) / ROWS;
  baseScale  = Math.min((spacingX*0.7)/214, (spacingY*0.7)/214); // 80 % cell
  catHeight  = 214 * baseScale;

  // ── Feature‑specific scales ────────────────────────────────────────────────
  Object.keys(scaleSpecs).forEach(key => {
    scales[key] = d3.scaleLinear()
      .domain(d3.extent(data, d => d[key]))
      .range(scaleSpecs[key]);
  });

  // ── Initial grid positions ────────────────────────────────────────────────
  data.forEach((d,i) => {
    const row = Math.floor(i / catsPerRow);
    const col = i % catsPerRow;
    d.x = PAD_X + col * spacingX + spacingX/2;
    d.y = PAD_Y + row * spacingY + spacingY/2 - catHeight/2; // top‑left of glyph
  });

  // ── Render CAT groups ─────────────────────────────────────────────────────
  const catG = svg.selectAll('g.cat')
    .data(data, d=>d.city)
    .enter()
      .append('g')
        .attr('class','cat')
        .attr('transform', d => `translate(${d.x},${d.y})`);

  // --- Glyph sub‑group (scaled) --------------------------------------------
  const glyph = catG.append('g')
    .attr('class','glyph')
    .attr('transform', `scale(${baseScale})`)
    .html(CAT_TEMPLATE);

  // --- Normalise IDs → classes inside each glyph ---------------------------
  glyph.each(function() {
    const g = d3.select(this);
    g.select('[id="head"]')     .attr('class','head')     .attr('id',null);
    g.select('[id="ears"]')     .attr('id',null);
    g.select('[id="earLeft"]')  .attr('class','ear-left') .attr('id',null);
    g.select('[id="earRight"]') .attr('class','ear-right').attr('id',null);
    g.select('[id="eyes"]')     .attr('class','eyes')     .attr('id',null);
    g.select('[id="tail"]')     .attr('class','tail')     .attr('id',null);
  });

  // --- Colouring + tooltips + per‑feature scaling --------------------------
  catG.each(function(d) {
    const g      = d3.select(this);
    const glyph  = g.select('.glyph');
    const A      = getAnchors(glyph);

    // colour
    glyph.select('.head circle')
         .attr('fill', d.color);
    glyph.selectAll('.ear-left path:first-child, .ear-right path:first-child')
         .attr('fill', d3.color(d.color).darker(0.8));
    glyph.select('.tail rect')
         .attr('fill', d3.color(d.color).darker(0.2));
    // Color body
    glyph.select('.bodychest')
         .attr('fill', d3.color(d.color).darker(0.2));
    // Color legs
    glyph.selectAll('#legsfront rect')
         .attr('fill', d3.color(d.color).darker(0.2));
    glyph.selectAll('#legsback rect')
          .attr('fill', d3.color(d.color).darker(0.9));
         

    // scale parts
    pivot(glyph.select('.head')      , A.headJoint , scales.head_size(d.head_size));
    pivot(glyph.select('.eyes')      , A.headCenter, scales.eye_width(d.eye_width));
    pivot(glyph.select('.tail')      , A.tailJoint , scales.tail_length(d.tail_length));
    const earScale = scales.ear_length(d.ear_length);
    pivot(glyph.select('.ear-left')  , A.earLeft   , earScale);
    pivot(glyph.select('.ear-right') , A.earRight  , earScale);

    // tooltips
    glyph.select('.head')     .append('title').text(`Testa: ${d.head_size}`);
    glyph.select('.eyes')     .append('title').text(`Occhi: ${d.eye_width}`);
    glyph.select('.ear-left') .append('title').text(`Orecchie: ${d.ear_length}`);
    glyph.select('.ear-right').append('title').text(`Orecchie: ${d.ear_length}`);
    glyph.select('.tail')     .append('title').text(`Coda: ${d.tail_length}`);
  });

  // --- City labels (outside scaled glyph) -----------------------------------
  const labels = svg.selectAll('text.city-label')
    .data(data, d=>d.city)
    .enter()
      .append('text')
        .attr('class','city-label')
        .attr('text-anchor','middle')
        .attr('font-size',16)
        .attr('fill','#333')
        .text(d=>d.city)
        .attr('x', d=>d.x + (spacingX/2 ? 0 : 0))  // centred horizontally
        .attr('y', d=>d.y + catHeight + 24);

  // --- Interactive sorting --------------------------------------------------
  function setupSorting(sel, key) {
    sel.on('click', () => sortBy(key));
  }
  setupSorting(glyph.selectAll('.head')     , 'head_size');
  setupSorting(glyph.selectAll('.eyes')     , 'eye_width');
  setupSorting(glyph.selectAll('.tail')     , 'tail_length');
  setupSorting(glyph.selectAll('.ear-left,.ear-right'), 'ear_length');

  // Sorting function (updates positions of cats + labels) --------------------
  function sortBy(key) {
    data.sort((a,b) => a[key] - b[key]);
    data.forEach((d,i) => {
      const row = Math.floor(i / catsPerRow);
      const col = i % catsPerRow;
      d.x = PAD_X + col * spacingX + spacingX/2;
      d.y = PAD_Y + row * spacingY + spacingY/2 - catHeight/2;
    });

    svg.selectAll('g.cat')
      .data(data, d=>d.city)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('transform', d => `translate(${d.x},${d.y})`);

    labels
      .data(data, d=>d.city)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('x', d=>d.x)
      .attr('y', d=>d.y + catHeight + 24);
  }
});
