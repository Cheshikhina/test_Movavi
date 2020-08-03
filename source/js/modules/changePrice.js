const changePrice = () => {
  const products = document.querySelectorAll('.product'),
    modalProductsTitles = document.querySelectorAll('.modal_card__title');
  let priceCommon, titleProduct;

  function checkEl(selector, parent) {
    if (parent.querySelector('.' + selector)) {
      return parent.querySelector('.' + selector);
    }
  }

  if (products[0]) {
    products.forEach(product => {
      const priceSale = checkEl('product__price_common', product);
      priceCommon = checkEl('product__price_sale span', product);
      titleProduct = checkEl('product__title', product);

      if (priceSale) {
        let priceSaleNum = parseInt((priceSale.textContent || priceSale.innerText).replace(/\D+/g, ''));
        priceCommon.textContent = priceSaleNum.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
      }

      modalProductsTitles.forEach(title => {
        if (title.textContent === titleProduct.textContent) {
          title.parentNode.querySelector('.modal_card__price').textContent = priceCommon.textContent.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ') + '.0 руб.';
        }
      });

      priceSale.textContent = '';
    });
  }

};

export default changePrice;
