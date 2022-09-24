export default function render() {
  const module = document.createElement('article');
  module.classList.add('module');
  module.id = 'about';
  module.innerHTML = `<div data-translate="about">
  AUGUR is an initiative of the Swiss Agency for Development (SDC) humanitarian accelerator “Innovation meets Practice” in 2021. <br><br>
  Its vision is to provide state-of-the-art information on climate variability and change which is <b>open-source</b>, <b>quality proven</b> and <b>easy to understand</b>.  <br><br>
  A first product is the development of a digital toolkit to assess the risk from heavy precipitation. Additional products will offer the calculation of riverine discharge and level of flooding for remote areas where no local and global trust worthful data is available.
  </div>`;
  return module;
}
