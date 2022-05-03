export default function render() {
  const module = document.createElement('article');
  module.classList.add('module');
  module.id = 'language';
  module.innerHTML = `<ul>
    <li><a href="#">English</a></li>
    <li><a href="#">Spanish</a></li>
    </ul>`;

  return module;
}
