// ---------------------------------------------------------------------------
// 1.  Inseriamo l’SVG (gruppi già etichettati con ID utili a D3)
// ---------------------------------------------------------------------------
const rawSvg = `
<rect width="256" height="256" fill="#1E1E1E"/>
<rect width="256" height="256" fill="white"/>

<!-- def gaussian blur -->
<defs>
  <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
  </filter>
</defs>
<ellipse cx="128" cy="217" rx="75" ry="15" fill="rgba(0, 0, 0, 0.08)" filter="url(#blur)"/>

<!-- raggruppo e traslo di 17px a destra per centrare il gatto -->
<g transform="translate(10, 15)">

  <!-- ------------- TESTA ------------- -->
  <g id="head">
    <!-- ------------- ORECCHIE ------------- -->
    <g id="ears">
      <g id="earLeft">
        <path d="M37.8372 20.573L67.8669 37.9108L37.8372 55.2486V20.573Z" fill="#b77024"/>
        <path d="M54.6276 37.9111L44.456 43.7837L44.4554 32.0386L54.6276 37.9111Z"
              fill="white" stroke="black" stroke-width="2"/>
      </g>
      <g id="earRight">   
        <path d="M116.931 20.573L86.9013 37.9108L116.931 55.2486V20.573Z" fill="#b77024"/>
        <path d="M100.14 37.9111L110.312 43.7837L110.313 32.0386L100.14 37.9111Z"
              fill="white" stroke="black" stroke-width="2"/>
      </g>
    </g>
    <circle cx="77.384" cy="79.8063" r="47.3867" fill="#fc9b31"/>
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
    <path d="M64.3442 79.8063c0 3.137-1.246 6.145-3.464 8.363-2.218 2.218-5.226
           3.464-8.363 3.464s-6.145-1.246-8.363-3.464c-2.218-2.218-3.464-5.226-3.464-8.363h23.654Z"
          fill="white" stroke="black" stroke-width="4" mask="url(#mouthLeftMask)"/>
    <path d="M114.08 79.8063c0 3.137-1.246 6.145-3.464 8.363-2.218 2.218-5.226
           3.464-8.363 3.464s-6.145-1.246-8.363-3.464c-2.218-2.218-3.464-5.226-3.464-8.363h23.654Z"
          fill="white" stroke="black" stroke-width="4" mask="url(#mouthRightMask)"/>
  </g>

  <!-- ------------- CODA ------------- -->
  <g id="tail">
    <rect x="173.989" y="92.2574" width="13.9589" height="36.5317"
          rx="6.97944" fill="#fc9b31"/>
  </g>

  <!-- corpo e zampe -->
   <rect width="13.9589" height="42.182" rx="6.97944"
        transform="matrix(-1 0 0 1 79.6456 161.255)" fill="#eb902e"/>
  <rect width="13.9589" height="37.1116" rx="6.97944"
        transform="matrix(-1 0 0 1 97.4032 161.255)" fill="#b77024"/>
  <rect width="13.9589" height="42.182" rx="6.97944"
        transform="matrix(-1 0 0 1 163.017 161.255)" fill="#eb902e"/>
  <rect width="13.9589" height="37.1116" rx="6.97944"
        transform="matrix(-1 0 0 1 180.774 161.255)" fill="#b77024"/>
  <rect x="52.9147" y="130.992" width="140.586" height="41.5093" rx="20.7546" fill="#eb902e"/>
 

  <!-- stellina decorativa -->
  <path d="M183.322 156.164L183.413 153.664L181.299 155.005L180.754 154.051L182.981 152.891L180.754 151.732L181.299 150.778L183.413 152.119L183.322 149.619H184.413L184.322 152.119L186.436 150.778L186.981 151.732L184.754 152.891L186.981 154.051L186.436 155.005L184.322 153.664L184.413 156.164H183.322Z"
        fill="black"/>


</g>
`;


d3.select('#cat').html(rawSvg);

// ---------------------------------------------------------------------------
// 2.  Utility
// ---------------------------------------------------------------------------
const slider2scale = (v, variable) => {
  switch (variable) {
    case 'ear':  return d3.scaleLinear().domain([1, 100]).range([0.6, 1.5])(v); // orecchie
    case 'eye':  return d3.scaleLinear().domain([1, 100]).range([0.6, 1.5])(v); // occhi
    case 'head': return d3.scaleLinear().domain([1, 100]).range([0.8, 1.1])(v); // testa
    case 'tail': return d3.scaleLinear().domain([1, 100]).range([0.5, 1.8])(v); // coda
    default:     return d3.scaleLinear().domain([1, 100]).range([0.5, 1.5])(v);
  }
};

// Bounding-box → ancoraggi aggiornati in tempo reale
function anchors () {
  const head     = d3.select('#head').node().getBBox();
  const tail     = d3.select('#tail').node().getBBox();
  const earLeft  = d3.select('#earLeft').node().getBBox();
  const earRight = d3.select('#earRight').node().getBBox();

  const headTopY = head.y; // bordo superiore della testa

  return {
    headCenter : [head.x + head.width  / 2, head.y + head.height / 2],
    headTop    : [head.x + head.width  / 2, headTopY],
    headJoint  : [head.x + head.width  / 2, head.y + head.height],   // base testa
    tailJoint  : [tail.x + tail.width  / 2, tail.y + tail.height],   // base coda
    earLeft    : [earLeft.x  + earLeft.width  / 2, earLeft.y  + earLeft.height],
    earRight   : [earRight.x + earRight.width / 2, earRight.y + earRight.height]
  };
}

// Trasforma: “scala attorno al punto (ax, ay)”
function pivot (sel, [ax, ay], s) {
  sel.attr('transform', `translate(${ax - ax * s},${ay - ay * s}) scale(${s})`);
}

// ---------------------------------------------------------------------------
// 3.  Collega gli slider (ancoraggi ricalcolati on-the-fly)
// ---------------------------------------------------------------------------
d3.select('#sl-eye').on('input', e => {
  const A = anchors();
  pivot(
    d3.select('#eyes'),
    A.headCenter,
    slider2scale(+e.target.value, 'eye')
  );
});

d3.select('#sl-head').on('input', e => {
  const A = anchors();
  pivot(
    d3.select('#head'),
    A.headJoint,
    slider2scale(+e.target.value, 'head')
  );
});

d3.select('#sl-tail').on('input', e => {
  const A = anchors();
  pivot(
    d3.select('#tail'),
    A.tailJoint,
    slider2scale(+e.target.value, 'tail')
  );
});

d3.select('#sl-ear').on('input', e => {
  const A = anchors();
  const scale = slider2scale(+e.target.value, 'ear');
  pivot(d3.select('#earLeft'), A.earLeft, scale);
  pivot(d3.select('#earRight'), A.earRight, scale);
  });

// ---------------------------------------------------------------------------
// 4.  Inizializzazione coerente con i valori degli slider
// ---------------------------------------------------------------------------
(function init () {
  // testa, occhi, coda
  ['head', 'eye', 'tail', 'ear'].forEach(variable => {
      const slider = d3.select(`#sl-${variable}`);
      const sel = d3.select(`#${variable}`);
      const anchor = anchors()[`${variable}Joint`] || anchors()[`${variable}Center`];
      // inizializza gli slider
      slider.property('value', 50);
      // inizializza le scale
    pivot(sel, anchor, slider2scale(+slider.value, variable));
  });
})();


