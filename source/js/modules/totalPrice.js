const totalPrice = () => {
  const totalPriceModal = document.querySelector('.modal__total_price'),
    totalPriceHeader = document.querySelector('.header__cart_price'),
    priceProducts = document.querySelectorAll('.modal_card__price');

  const arrPrices = (nod) => {
    let arr = [];
    nod.forEach(el => {
      arr.push(Number(el.textContent.replace(/[^0-9\.]/g, '').slice(0, -1)));
    });
    return arr;
  };
  const sum = arrPrices(priceProducts).reduce(function (total, amount) {
    return total + amount;
  }, 0);

  if (sum.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ') == 0) {
    localStorage.setItem('cart', 0);
  }
  totalPriceModal.textContent = sum.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ') + '.0 руб.';
  totalPriceHeader.textContent = sum.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ') + '.0 руб.';
};

export default totalPrice;
