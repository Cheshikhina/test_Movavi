const overlay = {};

overlay.scrollY = 0;
overlay.mainFunction = (arg) => {
  const body = document.querySelector('body'),
  header = document.querySelector('.header');

  function getScrollbarWidth() {
    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    body.appendChild(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;

    body.removeChild(div);
    return scrollWidth;
  }
  if (arg === 'remove' && body.classList.contains('body_hidden')) {
    body.classList.remove('body_hidden');
    body.style.paddingRight = 0;
    header.style.paddingRight = 0;
    window.scrollTo(0, parseInt(overlay.scrollY || '0', 10));
    body.style.top = 0;
  } else if (arg === 'add' && !body.classList.contains('body_hidden')) {
    overlay.scrollY = window.pageYOffset;
    body.classList.add('body_hidden');
    body.style.paddingRight = getScrollbarWidth() + 'px';
    header.style.paddingRight = getScrollbarWidth() + 'px';
    body.style.top = '-' + overlay.scrollY + 'px';
  }
  return overlay.scrollY;
};

export default overlay;
