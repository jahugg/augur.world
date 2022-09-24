export default function render() {
  const module = document.createElement('div');
  module.classList.add('module');
  module.id = 'home';
  module.innerHTML = `
    <article>  
      <h1>AUGUR.world</h1>
      <p data-translate="home">
      This site displays how much heavy rain you can expect today and under climate change anywhere on the globe. 
      <br><br>
      AUGUR.world is a prototype increasing the access to climate expert knowledge required by humanitarian actors.
      </p>
    </article>
    <footer>
    Precipitation [mm/day]
    <div id="legend">
    <div id="legend__colors"></div>
      <div id="legend__scale">
        <span id="legend__scale__min">0</span>
        <span id="legend__scale__max">1000</span>
      </div>
    </div>
    </footer>`;

  return module;
}
