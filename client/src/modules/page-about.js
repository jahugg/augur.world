export default function render() {
  const module = document.createElement('article');
  module.classList.add('module');
  module.id = 'about';
  module.innerHTML = `<div data-translate="about">
  AUGUR is an initiative of the Swiss Agency for Development (SDC) humanitarian innovation accelerator “Innovation meets Practice” in 2021. <br><br>

Its vision is to provide state-of-the-art information on climate disasters and change which is open source,  quality proven and feasible for humanitarian actors. These services reduce the financial and administrative costs to access climate expert knowledge. <br><br>

AUGUR combines information from satellite imaginary and climate change modelling. A first product is the development of a digital toolkit to assess the risk from heavy precipitation. Additional products will offer the calculation of riverine discharge and level of flooding for remote areas where no local and global trust worthful data is available. <br><br>

<img src="https://www.augur.world/images/AUGUR-process-Ilustration-vertical.png" alt="AUGUR Process" class="center">
  </div>`;
  return module;
}
