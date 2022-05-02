import L from 'leaflet';
import { transformation } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pinImage from 'url:./assets/icons/location_pin.svg';
import pinShadowImage from 'url:./assets/icons/location_pin_shadow.svg';

// static data file for demonstration purpose
import locationData from './locationData.json';

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

  const locationData = fetchLocationData(latlng);
  const precipitationGraph = getPrecipitationGraph(locationData);
  const graphContainer = document.getElementById('map__contents__details__graph');
  graphContainer.replaceChildren(precipitationGraph);
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

/**
 * fetch location data from server
 * @return {Object}      Object with lat and lng coordinates
 * @todo replace static json data with live server request.
 */
function fetchLocationData(latlng) {
  let data = {};
  data = locationData;
  return data;
}

function getPrecipitationGraph(data) {
  const defaultPeriod = 2030;

  // get max value and column count
  const values = [];
  for (let key in data.period[defaultPeriod].years) {
    values.push(data.period[defaultPeriod].years[key].present);
    values.push(data.period[defaultPeriod].years[key].climate_change);
  }

  const maxValue = Math.max(...values);
  const columnCount = Object.keys(data.period[defaultPeriod].years).length;

  // start drawing
  const graphHeight = 300;
  const unit = graphHeight / maxValue;
  //   let maxY = Math.ceil(maxValue / 10) * 10;
  const xmlns = 'http://www.w3.org/2000/svg';
  const graphEl = document.createElementNS(xmlns, 'svg');
  graphEl.classList.add('graph');
  graphEl.setAttributeNS(null, 'height', graphHeight);
  graphEl.setAttributeNS(null, 'shape-rendering', 'crispEdges');
  //   graphEl.setAttributeNS(null, "viewBox", "0 0 " + this.width + " " + this.height);
  graphEl.setAttributeNS(null, 'version', '1.1');


//   console.log(getComputedStyle(document.querySelector("b")).getPropertyValue("--my-custom-property-2"));

  // draw scale
  // make us of <pattern> tag instead
  const scale = document.createElementNS(xmlns, 'g');
  scale.classList.add('precipitation-graph__scale');
  graphEl.appendChild(scale);

  let yStepSizePx = unit * 10;
  let count = graphHeight / yStepSizePx;
  for (let i = 0; i <= count; i++) {
    let y = i * yStepSizePx;
    let line = document.createElementNS(xmlns, 'line');
    line.classList.add('x-line');
    line.setAttributeNS(null, 'x1', '0');
    line.setAttributeNS(null, 'x2', '100%');
    line.setAttributeNS(null, 'y1', y);
    line.setAttributeNS(null, 'y2', y);

    scale.appendChild(line);
  }

  // draw columns
  const columns = document.createElementNS(xmlns, 'g');
  columns.classList.add('precipitation-graph__columns');
  graphEl.appendChild(columns);

  let yearObj = data.period[defaultPeriod].years;
  let xStepSizePct = 100 / (columnCount + 1);
  let index = 1;
  for (let years in yearObj) {
    let value = unit * yearObj[years].present;
    let xPos = index * xStepSizePct;
    let rect = document.createElementNS(xmlns, 'rect');
    rect.classList.add('rect-present');
    rect.setAttributeNS(null, 'x', `${xPos}%`);
    rect.setAttributeNS(null, 'height', value);

    columns.appendChild(rect);

    let label = document.createElementNS(xmlns, 'text');
    label.classList.add('column-label');
    label.setAttributeNS(null, 'x', `${xPos}%`);
    label.setAttributeNS(null, 'y', -10);
    label.textContent = years;

    columns.appendChild(label);

    index++;
  }

  return graphEl;
}

init();

// helpers
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
