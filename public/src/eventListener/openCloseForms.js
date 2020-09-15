export function displayForm(e) {
  let name = extractName(e);
  document.removeEventListener(`open-${name}`, displayForm);
  let form = document.createElement(name);
  document.querySelector('main').appendChild(form);
  document.addEventListener(`close-${name}`, closeForm);
}

export function closeForm(e) {
  let name = extractName(e);
  document.removeEventListener(`close-${name}`, closeForm);
  document.querySelector(name).remove();
  document.addEventListener(`open-${name}`, displayForm);
}

function extractName(event) {
  let name = event.type.split('-');
  name.shift();
  return name.join('-');
}
