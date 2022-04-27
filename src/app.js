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
    opacity: .5,
  });

  // create map
  map = new L.Map('map__contents__tiles', {
    center: new L.LatLng(0, 0),
    zoom: 4,
    minZoom: 4,
    zoomControl: false,
    // maxBounds: L.latLngBounds(L.latLng(50, -74.227), L.latLng(40.774, -74.125)),
    maxBounds: [
      [-50, -Infinity],
      [50, Infinity],
    ],
    layers: [baseLayer, augurLayer],
  });

  // add event listeners
  // selecting location (use long press for touch devices)
  if (is_touch_enabled()) map.addEventListener('contextmenu', (event) => setLocation(event.latlng));
  else map.addEventListener('click', (event) => setLocation(event.latlng));

  let menuBtn = document.getElementById('map__controls__menu-btn');
  menuBtn.addEventListener('click', toggleAside);

  let closeMenuBtn = document.getElementById('map__close');
  closeMenuBtn.addEventListener('click', toggleAside.bind('close'));

  let asideHeaderButtons = document.querySelectorAll('#aside nav a');
  for (let link of asideHeaderButtons) link.addEventListener('click', loadPage);

  const clearLocationBtn = document.querySelector("#map__contents__navigate__search img");
  clearLocationBtn.addEventListener("click", clearLocation);
}

/**
 * loading the contents of a new page within the aside section
 * @param  {Object} event Event that triggered the function
 */
function loadPage(event) {
  const targetLink = event.target.closest('a');
  const parent = targetLink.closest('nav');
  for (let child of parent.children) delete child.dataset.selected;
  targetLink.dataset.selected = '';
}

/**
 * setting a new location on the map
 * @param  {Object} latlnt Coorinates of the new location as {lat:x, lng:y}
 * @todo update everything related to the new location
 */
function setLocation(latlng) {
  marker.setLatLng(latlng).addTo(map);

  // update seach field input
    const mapEl = document.getElementById('map');
    delete mapEl.dataset.detailsClosed;

  // load and open details view
}

function clearLocation(event) {
    const mapEl = document.getElementById('map');
    mapEl.dataset.detailsClosed = '';

    //clear search field input

    // close details view

    console.log("clear location")
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
