export default function render() {
  const module = document.createElement('article');
  module.classList.add('module');
  module.id = 'language';
  module.innerHTML = `
    <label>
      <input type="radio" name="language" value="en" checked>
      English
    </label>
    <label>
      <input type="radio" name="language" value="es">
      Spanish
    </label>
    <label>
      <input type="radio" name="language" value="es">
      German
    </label>`;

  return module;
}
