export default function render() {
  const module = document.createElement('article');
  module.classList.add('module');
  module.id = 'language';
  module.innerHTML = `
    <div class='languages-inputes-container'>
      <label>
        <input type="radio" name="language" value="en" checked>
        English
      </label>
      <label>
        <input type="radio" name="language" value="es">
        Spanish
      </label>
      <label>
        <input type="radio" name="language" value="de">
        German
      </label>
    </div>`;

  
  return module;
}

export const init = (cb) => {
  cb();
}


