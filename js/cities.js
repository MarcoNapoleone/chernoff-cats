// viz.js
// Chernoff Cats grid visualization

// Setup SVG dimensions and margins
const svg = d3.select('#cats-grid');
const width = +svg.attr('viewBox').split(' ')[2];
const height = +svg.attr('viewBox').split(' ')[3];

// Define features and their corresponding properties
const features = [
  {key: 'ear_length', name: 'Orecchie'},
  {key: 'eye_width', name: 'Occhi'},
  {key: 'head_size', name: 'Testa'},
  {key: 'tail_length', name: 'Coda'}
];

// Load data
d3.json('data/cats.json').then(data => {
  // Compute spacing
  const padding = 60;
  const spacing = (width - 2 * padding) / data.length;
  const centerY = height / 2;

  // Compute scales for each feature
  const scales = {};
  features.forEach(f => {
    const values = data.map(d => d[f.key]);
    scales[f.key] = d3.scaleLinear()
      .domain([d3.min(values), d3.max(values)])
      .range([10, 40]); // size range in pixels
  });

  // Initial positions
  data.forEach((d, i) => {
    d.x = padding + i * spacing + spacing / 2;
    d.y = centerY;
  });

  // Create group for each cat
  const cats = svg.selectAll('g.cat')
    .data(data, d => d.city)
    .enter()
    .append('g')
      .attr('class', 'cat')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer');

  // Draw head
  cats.append('circle')
    .attr('class', 'head')
    .attr('r', d => scales['head_size'](d.head_size))
    .attr('fill', d => d.color)
    .on('click', () => sortBy('head_size'));

  // Draw ears as triangles
  cats.append('path')
    .attr('class', 'ears')
    .attr('d', d => {
      const earSize = scales['ear_length'](d.ear_length);
      // Left ear
      const left = [
        [-earSize, -earSize],
        [-earSize * 0.5, -earSize * 1.5],
        [0, -earSize]
      ];
      // Right ear (mirrored)
      const right = left.map(p => [ -p[0], p[1] ]);
      return d3.path().toString();
    })
    .attr('fill', d => d3.color(d.color).darker(0.5))
    .on('click', () => sortBy('ear_length')); // feature click

  // Draw eyes
  cats.append('ellipse')
    .attr('class', 'eyes')
    .attr('cx', d => -scales['eye_width'](d.eye_width) * 0.6)
    .attr('cy', d => -scales['head_size'](d.head_size) * 0.2)
    .attr('rx', d => scales['eye_width'](d.eye_width) * 0.5)
    .attr('ry', d => scales['eye_width'](d.eye_width) * 0.3)
    .attr('fill', '#000')
    .on('click', () => sortBy('eye_width'));
  cats.append('use')
    .attr('xlink:href', '#')
    .attr('transform', d => `translate(${scales['eye_width'](d.eye_width) * 1.2},${-scales['head_size'](d.head_size) * 0.2})`)
    .attr('d', d => scales['eye_width'](d.eye_width) * 0.5)
    .on('click', () => sortBy('eye_width'));

  // Draw tail
  cats.append('line')
    .attr('class', 'tail')
    .attr('x1', d => scales['head_size'](d.head_size))
    .attr('y1', 0)
    .attr('x2', d => scales['head_size'](d.head_size) + scales['tail_length'](d.tail_length))
    .attr('y2', 0)
    .attr('stroke', d => d3.color(d.color).darker(1))
    .attr('stroke-width', 4)
    .on('click', () => sortBy('tail_length'));

  // City labels
  cats.append('text')
    .attr('class', 'city-label')
    .attr('y', d => scales['head_size'](d.head_size) + 10)
    .text(d => d.city);

  // Sorting function
def sortBy(key) {
    // Sort data array
    data.sort((a, b) => a[key] - b[key]);
    // Update x positions
    data.forEach((d, i) => {
      d.x = padding + i * spacing + spacing / 2;
    });
    // Transition groups
    svg.selectAll('g.cat')
      .data(data, d => d.city)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('transform', d => `translate(${d.x}, ${d.y})`);
  }
});
