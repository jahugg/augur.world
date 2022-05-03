export default function render() {
  const module = document.createElement('div');
  module.classList.add('module');
  module.id = 'home';
  module.innerHTML = `
    <article>  
      <h1>AUGUR.world</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, nobis fuga! Odit repellat debitis quaerat unde inventore nemo explicabo
        dolor blanditiis quasi architecto in ad non, sunt culpa reiciendis corrupti.
      </p>
    </article>
    <footer>legend</footer>`;

  return module;
}
