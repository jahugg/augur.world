import L from 'leaflet';
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
const defaultPage = 'home';
const pages = {
  home: {
    title: 'Home',
    slug: '/',
    module: import('./modules/page-home.js'),
  },
  language: {
    title: 'Language',
    slug: '/language',
    module: import('./modules/page-language.js'),
  },
  about: {
    title: 'About',
    slug: '/about',
    module: import('./modules/page-about.js'),
  },
};

/**
 * initialize the application
 */
function init() {
  document.addEventListener('DOMContentLoaded', function () {
    navigateToCurrentURL();
  });

  window.addEventListener('popstate', (event) => {
    let stateObj = { pageKey: event.state.pageKey };
    buildPage(stateObj, false);
  });

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

  let asideHeaderButtons = document.querySelectorAll('#aside header nav a');
  for (let link of asideHeaderButtons) link.addEventListener('click', onClickPageLink);

  const clearLocationBtn = document.querySelector('#map__contents__navigate__search .icon[alt="Clear"]');
  clearLocationBtn.addEventListener('click', clearLocation);

  const detailsHandler = document.querySelector('#map__contents__details__drag-handle');
  detailsHandler.addEventListener('click', handleDetailsPosition);

  // for testing
  setLocation({ lat: -12.101622, lng: -76.985037 });
}

function navigateToCurrentURL() {
  let urlSlug = window.location.pathname;
  let pageKey = defaultPage;
  for (let key in pages) if (pages[key].slug === urlSlug) pageKey = key;
  let stateObj = { pageKey: pageKey };
  buildPage(stateObj, false);
}

/**
 * handle/toggle details position
 * @param  {Object} event Event that triggered the function
 */
function handleDetailsPosition(event) {
  const mapEl = document.getElementById('map');
  mapEl.hasAttribute('data-details-as-sheet') ? delete mapEl.dataset.detailsAsSheet : (mapEl.dataset.detailsAsSheet = '');
}

/**
 * loading the contents of a new page within the aside section
 * @param  {Object} event Event that triggered the function
 */
async function buildPage(stateObj, addToHistory) {
  let pageKey = stateObj.pageKey;
  let page = pages[pageKey];
  document.title = 'Augur | ' + page.title;

  // mark current link as selected
  const navigation = document.querySelector('#aside nav');
  for (let child of navigation.children) delete child.dataset.selected;
  navigation.querySelector(`a[href="${page.slug}"]`).dataset.selected = '';

  // update URL and history
  if (addToHistory) history.pushState(stateObj, '', page.slug);

  // load module contents
  const target = document.getElementById('aside__content');
  const module = await page.module;
  const content = await module.default(); // render
  target.replaceChildren(content);
  module.init?.(); // only run if function exists
}

/**
 * prevent default link behaviour and trigger page loading
 * @param  {Event} event Event that triggered the function
 */
function onClickPageLink(event) {
  event.preventDefault();
  const link = event.target.closest('a');
  const slug = link.getAttribute('href');

  // find corresponding page object
  let pageKey;
  for (const key in pages) if (pages[key].slug === slug) pageKey = key;

  // define stateobj and buildpage
  const stateObj = { pageKey: pageKey };
  buildPage(stateObj, true);
}

/**
 * setting a new location on the map
 * @param  {Object} latlnt Coorinates of the new location as {lat:x, lng:y}
 * @todo update everything related to the new location
 */
async function setLocation(latlng) {
  marker.setLatLng(latlng).addTo(map);

  // pan to location on map...

  // update url

  // update search field input
  const mapEl = document.getElementById('map');
  delete mapEl.dataset.detailsClosed;

  // load and open details view
  let latlngOfLima = { lat: -12.101622, lng: -76.985037 }; // for demonstration!
  const locationData = await fetchLocationData(latlngOfLima);
  // const precipitationGraph = drawPrecipitationGraphSVG(locationData);
  const precipitationGraph = drawPrecipitactionGraphDOM(locationData);
  const graphContainer = document.getElementById('map__contents__details__graph');
  graphContainer.replaceChildren(precipitationGraph);
}

function clearLocation(event) {
  const mapEl = document.getElementById('map');
  mapEl.dataset.detailsClosed = '';
  mapEl.dataset.detailsAsSheet = '';

  //clear search field input
  // close details view
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
async function fetchLocationData(latlng) {
  const response = await fetch(`${process.env.SERVER}/api/location?lat=${latlng.lat}&lng=${latlng.lng}`);
  return await response.json();
}

function drawPrecipitationGraphSVG(data) {
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
  const xLabelHeight = 30;
  const yLabelWidth = 30;
  const fontSize = 15;
  const unit = graphHeight / maxValue;
  //   let maxY = Math.ceil(maxValue / 10) * 10;
  const xmlns = 'http://www.w3.org/2000/svg';
  const graphEl = document.createElementNS(xmlns, 'svg');
  graphEl.classList.add('graph');
  graphEl.setAttributeNS(null, 'height', graphHeight + xLabelHeight);
  graphEl.setAttributeNS(null, 'shape-rendering', 'crispEdges');
  //   graphEl.setAttributeNS(null, "viewBox", "0 0 " + this.width + " " + this.height);
  graphEl.setAttributeNS(null, 'version', '1.1');

  // create svg definitions
  // const defs = document.createElementNS(xmlns, 'defs');
  // graphEl.appendChild(defs);

  // // grid pattern
  // let gridPattern = document.createElementNS(xmlns, 'pattern');
  // graphEl.setAttributeNS(null, 'width', '100%');
  // graphEl.setAttributeNS(null, 'height', unit * 10);
  // defs.appendChild(gridPattern);

  // let rect = document.createElementNS(xmlns, 'rect');
  // rect.setAttributeNS(null, 'x', `${xPos}%`);
  // rect.setAttributeNS(null, 'height', value);
  // gridPattern.appendChild(rect)

  //   console.log(getComputedStyle(document.querySelector("b")).getPropertyValue("--my-custom-property-2"));

  // draw scale
  // make us of <pattern> tag instead
  let scale = document.createElementNS(xmlns, 'g');
  scale.classList.add('precipitation-graph__scale');
  graphEl.appendChild(scale);

  let yStepSizePx = unit * 10;
  let count = graphHeight / yStepSizePx;
  for (let i = 0; i <= count; i++) {
    let yPos = i * yStepSizePx;

    let row = document.createElementNS(xmlns, 'g');
    row.setAttributeNS(null, 'transform', `translate( 0, ${yPos} )`);
    scale.appendChild(row);

    let line = document.createElementNS(xmlns, 'line');
    line.classList.add('row-line');
    line.setAttributeNS(null, 'x1', '0');
    line.setAttributeNS(null, 'x2', '100%');
    line.setAttributeNS(null, 'y1', 0);
    line.setAttributeNS(null, 'y2', 0);
    row.appendChild(line);

    let labelBg = document.createElementNS(xmlns, 'rect');
    labelBg.classList.add('row-labelbg');
    labelBg.setAttributeNS(null, 'x', 0);
    labelBg.setAttributeNS(null, 'y', fontSize - yStepSizePx);
    labelBg.setAttributeNS(null, 'width', yLabelWidth);
    labelBg.setAttributeNS(null, 'height', fontSize);
    row.appendChild(labelBg);

    let label = document.createElementNS(xmlns, 'text');
    label.classList.add('row-label');
    label.setAttributeNS(null, 'x', 0);
    label.setAttributeNS(null, 'y', fontSize - yStepSizePx / 2);
    label.textContent = parseInt((count - i) * 10);
    row.appendChild(label);
  }

  // draw columns
  let columns = document.createElementNS(xmlns, 'g');
  columns.classList.add('precipitation-graph__columns');
  graphEl.appendChild(columns);

  let yearObj = data.period[defaultPeriod].years;
  let xStepSizePct = 100 / (columnCount + 1);
  let index = 1;

  for (let years in yearObj) {
    let value = yearObj[years].present;
    let valuePx = unit * value;
    let xPos = index * xStepSizePct;

    let column = document.createElementNS(xmlns, 'g');
    column.classList.add('column');
    column.setAttributeNS(null, 'transform', `translate( 0, 0 )`);
    columns.appendChild(column);

    let rect = document.createElementNS(xmlns, 'rect');
    rect.classList.add('rect-present');
    rect.setAttributeNS(null, 'x', `${xPos}%`);
    rect.setAttributeNS(null, 'y', 0);
    rect.setAttributeNS(null, 'height', valuePx);
    column.appendChild(rect);

    let columnLabel = document.createElementNS(xmlns, 'text');
    columnLabel.classList.add('column-label');
    columnLabel.setAttributeNS(null, 'x', `${xPos}%`);
    columnLabel.setAttributeNS(null, 'y', fontSize);
    columnLabel.textContent = years + 'y';
    column.appendChild(columnLabel);

    let valueLabel = document.createElementNS(xmlns, 'text');
    valueLabel.classList.add('column-value');
    valueLabel.setAttributeNS(null, 'x', `${xPos}%`);
    valueLabel.setAttributeNS(null, 'y', valuePx);
    valueLabel.textContent = value;
    column.appendChild(valueLabel);

    index++;
  }

  return graphEl;
}

function drawPrecipitactionGraphDOM(data) {
  const defaultPeriod = 2030;
  const rowLabelStepSize = 10;

  // get max value and column count
  const values = [];
  for (let key in data.period[defaultPeriod].years) {
    values.push(data.period[defaultPeriod].years[key].present);
    values.push(data.period[defaultPeriod].years[key].climate_change);
  }

  const maxValue = Math.max(...values);
  const ceiledMaxValue = Math.ceil(maxValue / rowLabelStepSize) * rowLabelStepSize;
  const rowCount = ceiledMaxValue / rowLabelStepSize;
  const yearObj = data.period[defaultPeriod].years;
  const unitPct = 100 / ceiledMaxValue;

  let graph = document.createElement('div');
  graph.classList.add('graph-precip');

  // draw row labels
  let rowLabelSection = document.createElement('div');
  rowLabelSection.classList.add('row-label-section');
  graph.appendChild(rowLabelSection);

  for (let i = 0; i <= rowCount; i++) {
    let rowLabel = document.createElement('div');
    rowLabel.classList.add('row-label');
    rowLabel.innerHTML = i * rowLabelStepSize;
    rowLabelSection.appendChild(rowLabel);
  }

  // draw column labels
  let columnLabelSection = document.createElement('div');
  columnLabelSection.classList.add('column-label-section');
  graph.appendChild(columnLabelSection);

  for (let years in yearObj) {
    let columnLabel = document.createElement('div');
    columnLabel.classList.add('column-label');
    columnLabel.innerHTML = years;
    columnLabelSection.appendChild(columnLabel);
  }

  // draw graph items
  let graphSection = document.createElement('div');
  graphSection.classList.add('graph-section');
  graph.appendChild(graphSection);

  for (let years in yearObj) {
    let value = yearObj[years].present;
    let valuePct = value * unitPct;

    let rect = document.createElement('div');
    rect.classList.add('graph-item');
    rect.style.height = valuePct+'%';
    rect.innerHTML = value;
    graphSection.appendChild(rect);
  }

  return graph;
}

init();

// helper functions
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
