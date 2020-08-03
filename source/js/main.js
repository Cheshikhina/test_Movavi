import 'svgxuse';
import './forIE/polyfills';
import common from './modules/common';
import timer from './modules/timer';
import modal from './modules/modal';
import cart from './modules/cart';

window.addEventListener('DOMContentLoaded', () => {
  common();
  timer('.offer', 15);


  if (!localStorage.getItem('cart') && localStorage.key('cart') !== 'cart') {
    cart();
    modal('.product');
    modal('.header__cart');
  } else {
    if (localStorage.getItem('cart') == 0) {
      const totalPriceModal = document.querySelector('.modal__total_price'),
        totalPriceHeader = document.querySelector('.header__cart_price');
      totalPriceModal.textContent = '0.0 руб.';
      totalPriceHeader.textContent = '0.0 руб.';
      modal('.header__cart');
      modal('.product');
    } else {
      modal('.header__cart');
      modal('.product', false, localStorage.getItem('cart'));
    }
  }
});
