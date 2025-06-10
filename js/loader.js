// js/loader.js
// Loads the datasets and kicks off the visualization

Promise.all([
  d3.json('data/cats.json'),
  //d3.json('data/italy.geojson')
])
  .then(([data, italy]) => {
    if (window.initViz) {
      window.initViz(data, italy);
    } else {
      console.error('viz.js has not loaded yet.');
    }
  })
  .catch(err => console.error('Error loading data:', err));
