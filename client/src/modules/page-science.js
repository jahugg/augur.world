export default function render() {
  const module = document.createElement('article');
  module.classList.add('module');
  module.id = 'science';
  module.innerHTML = `<div data-translate="science">
AUGUR estimates extreme precipitation events at 5-kilometer resolution from the satellite product <a href="https://www.nature.com/articles/sdata201566/">CHIRPS</a>. The events derive from annual maximum one-day precipitation sums [mm/d] fitted by statistical distribution for extreme events. <br><br>

Estimated events are corrected using ground precipitation observations from  <a href="https://www.ncei.noaa.gov/products/land-based-station/global-historical-climatology-network-daily/">GHCN</a>. This correction allows to account for the underestimation of the satellite precipitation particularly over tropical regions. <br><br>

The climate change signals are computed from the Intergovernmental Panel on Climate Change (IPCC) Sixth Assessment Report (AR6). The data shows only the SS5-8.5 scenario. 

  </div>`;
  return module;
}
