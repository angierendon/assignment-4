// Set the Mapbox access token so the map can authenticate with Mapbox services.
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5naWUxMjM1MyIsImEiOiJjbWF2aHJnOHQwNGx1MmpwdnMyaXVnZHN0In0.odV43jezFdD0s7CW9uaJXQ';

// Create the map instance and configure the initial view.
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-122.4194, 37.7749],
    zoom: 10,
    pitch: 25
});

// Verify the trail data loaded correctly from trail-data.js.
console.log(trailData);

// Wait for the Mapbox map to finish loading before adding the trail source and layer.
map.on('load', () => {
    map.addSource('trails', {
        type: 'geojson',
        data: trailData // this is the GeoJSON data loaded from trail-data.js
    });
    
    map.addLayer({
        id: 'trail-lines',
        type: 'line',
        source: 'trails',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#c3ff00',
            'line-width': 3
        }
    });
});

// Define camera views for each story chapter keyed by the data-location value.
const chapters = {
  'marina-bay': {
    center: [-122.344841, 37.908118],
    zoom: 18,
    pitch: 50,
    bearing: -20
  },
  'Ohlone-greenway': {
    center: [-122.299011, 37.902725],
    zoom: 18,
    pitch: 50,
    bearing: 0
  },
  'emeryville-greenway': {
    center: [-122.289201, 37.847726],
    zoom: 18,
    pitch: 50,
    bearing: 0
  },
  'ironhorse-trail': {
    center: [-122.0012255, 37.8209442],
    zoom: 18,
    pitch: 50,
    bearing: 0
  }
  // more chapters to come...
};

// Smoothly move the map to the selected chapter's camera position.
function flyToChapter(locationKey) {
  const chapter = chapters[locationKey];
  if (!chapter) return;

  map.flyTo({
    center: chapter.center,
    zoom: chapter.zoom,
    pitch: chapter.pitch,
    bearing: chapter.bearing,
    speed: 0.7,
    curve: 1.5,
    essential: true
  });
}

// Add click handlers to each story card that corresponds to a chapter.
const chapterCards = document.querySelectorAll('.chapter');
chapterCards.forEach((card) => {
  const locationKey = card.dataset.location;

  // Only attach interaction for cards that have a matching chapter defined.
  if (!chapters[locationKey]) return;

  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    flyToChapter(locationKey);
  });
});

// Add a scroll listener to the story panel so non-intro cards fade in after scrolling.
const storyPanel = document.getElementById('story');
if (storyPanel) {
  storyPanel.addEventListener('scroll', () => {
    if (storyPanel.scrollTop > 20) {
      storyPanel.classList.add('scrolled');
    }
  }, { passive: true });
}



