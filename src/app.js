import L from 'leaflet';
import { bind } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinImage from 'url:./assets/icons/location_pin.svg';
import pinShadowImage from 'url:./assets/icons/location_pin_shadow.svg';

let map;
const locationIcon = new L.icon({
  iconUrl: pinImage,
  shadowUrl: pinShadowImage,

  iconSize: [48, 48], // size of the icon
  shadowSize: [48, 48], // size of the shadow
  iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
  shadowAnchor: [24, 48], // the same for the shadow
  popupAnchor: [24, 0], // point from which the popup should open relative to the iconAnchor
});
const marker = new L.marker([0, 0], { icon: locationIcon });

/**
 * initialize the application
 */
function init() {
  // configure tile layer
  let baseLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
    attribution: `attribution: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>`,
    detectRetina: true,
  });

  let augurLayer = L.tileLayer('https://obellprat.github.io/tilesaugur/tiles100/{z}/{x}/{-y}.png', {
    detectRetina: true,
    opacity: 0.5,
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

  let menuBtn = document.getElementById('map__contents__navigate__menu-toggle');
  menuBtn.addEventListener('click', toggleAside);

  let closeMenuBtn = document.getElementById('map__close');
  closeMenuBtn.addEventListener('click', toggleAside.bind('close'));

  let asideHeaderButtons = document.querySelectorAll('#aside nav a');
  for (let link of asideHeaderButtons) link.addEventListener('click', loadPage);

  const clearLocationBtn = document.querySelector('#map__contents__navigate__search .icon[alt="Clear"]');
  clearLocationBtn.addEventListener('click', clearLocation);
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

  // update search field input
  const mapEl = document.getElementById('map');
  delete mapEl.dataset.detailsClosed;

  // load and open details view
}

function clearLocation(event) {
  const mapEl = document.getElementById('map');
  mapEl.dataset.detailsClosed = '';

  //clear search field input

  // close details view

  console.log('clear location');
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
