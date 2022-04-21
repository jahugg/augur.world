import L from 'leaflet';
import { bind } from 'leaflet';
import 'leaflet/dist/leaflet.css';

let map;
const marker = new L.marker();
/**
 * initialize the application
 * @param  {Number} num1 The first number
 * @param  {Number} num2 The second number
 * @return {Number}      The total of the two numbers
 */
function init() {
  // configure tile layer
  let baseLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
    attribution: `attribution: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>`,
    detectRetina: true,
  });

  let augurLayer = L.tileLayer('https://obellprat.github.io/tilesaugur/tiles100/{z}/{x}/{-y}.png', {
    detectRetina: true,
    opacity: 0.6
  });

  // create map
  map = new L.Map('map__contents__tiles', {
    center: new L.LatLng(0, 0),
    zoom: 3,
    zoomControl: false,
    layers: [baseLayer, augurLayer],
  });

  // add event listeners
  // selecting location (use long press for touch devices)
  if (is_touch_enabled()) map.addEventListener('contextmenu', (event) => setLocation(event.latlng));
  else map.addEventListener('click', (event) => setLocation(event.latlng));

  let menuBtn = document.getElementById('map__controls__menu-btn');
  menuBtn.addEventListener('click', toggleAside);
  
  let closeMenuBtn = document.getElementById('map__close');
  closeMenuBtn.addEventListener('click', toggleAside.bind("close"));
}

/**
 * setting a new location on the map
 * @param  {Object} latlnt Coorinates of the new location as {lat:x, lng:y}
 * @todo update everything related to the new location
 */
function setLocation(latlng) {
  marker.setLatLng(latlng).addTo(map);
}

/**
 * detect touch screen device
 * @return {Boolean}      true if touch device detected
 */
function is_touch_enabled() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

/**
 * toggle aside
 * @return {String}      set target state open/close/(empty = toggle)
 */
function toggleAside(targetState) {
  const attr = 'data-aside-closed';
  const app = document.getElementById('app');

  if (targetState === 'close') app.setAttribute(attr, '');
  else if (targetState === 'open') app.removeAttribute(attr);
  else app.hasAttribute(attr) ? app.removeAttribute(attr) : app.setAttribute(attr, '');
}

init();
