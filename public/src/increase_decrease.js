export function increase(e) {
  logic(e, '+');
}

export function decrease(e) {
  logic(e, '-');
}

function logic(e, operator) {
  e.preventDefault();
  const incTarget = document.getElementById(e.target.getAttribute('for'));

  if (incTarget.value) {
    let step = parseFloat(incTarget.getAttribute('step'));
    if (!step) {
      step = 1;
    }

    let newValue = parseFloat(incTarget.value);
    if (operator === '-') {
      newValue -= step;
    } else {
      newValue += step;
    }
    incTarget.value = Math.round(newValue * 10) / 10;
  } else {
    incTarget.value = incTarget.getAttribute('placeholder');
  }

  let event = document.createEvent('HTMLEvents');
  event.initEvent('change', false, true);
  incTarget.dispatchEvent(event);
}
